from flask import Blueprint, request, jsonify, current_app, session
from db import get_db_connection
from email_utils import send_admin_invite
import secrets 
from datetime import datetime, timedelta,timezone
from logger_utils import log_activity

admin_users_bp = Blueprint("admin_users", __name__)

def get_current_user():
    admin_id = session.get("admin_id")
    if not admin_id:
        return None
    
    # If role is missing from session, fetch it from DB
    role = session.get("role")
    if not role:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT role FROM admin WHERE id=%s", (admin_id,))
        user = cursor.fetchone()
        role = user['role'] if user else None
        session["role"] = role # Re-save it
        cursor.close()
        conn.close()

    return {"id": admin_id, "role": role}

# ------------------ GET USERS ------------------
@admin_users_bp.route("/admin/users", methods=["GET"])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, email, role, status FROM admin")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users), 200

# ------------------ INVITE USER ------------------
@admin_users_bp.route("/admin/users", methods=["POST"])
def add_user():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    role_to_assign = data.get("role")

    current_user = get_current_user()

    if not current_user:
        return jsonify({"error": "Session expired. Please log in again."}), 401

    if current_user["role"] != "SUPER_ADMIN":
        return jsonify({"error": "Unauthorized. Super Admin only."}), 403

    token = secrets.token_urlsafe(32)
    # Using timezone-aware object for consistency
    now = datetime.now(timezone.utc).replace(tzinfo=None) 
    expires_at = now + timedelta(hours=48)

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # 1. Try Database Insertion
        cursor.execute("""
            INSERT INTO admin 
            (name, email, role, status, invite_token, invite_expires_at, force_password_change, password)
            VALUES (%s, %s, %s, 'INVITED', %s, %s, 1, 'TEMP_PASS')
        """, (name, email, role_to_assign, token, expires_at))
        conn.commit()
        
    except Exception as db_error:
        conn.rollback()
        # CHECK FOR DUPLICATE EMAIL
        if "Duplicate entry" in str(db_error):
            return jsonify({"error": "This email is already registered."}), 409
        
        print(f"Database Error: {db_error}")
        log_activity("Invited Admin", f"{name} ({role_to_assign})")
        return jsonify({"error": "A database error occurred."}), 500
    finally:
        cursor.close()
        conn.close()

    # 2. Try Email Sending
    invite_link = f"http://localhost:5173/setup-password?token={token}"
    email_status = "sent"
    
    try:
        send_admin_invite(current_app, email, name, invite_link)
    except Exception as e:
        print("Email sending failed:", e)
        email_status = "failed"

    return jsonify({
        "status": "invited",
        "email_status": email_status
    }), 201

# ------------------ DELETE USER ------------------
@admin_users_bp.route("/admin/users/<int:uid>", methods=["DELETE"])
def remove_user(uid):
    current_user = get_current_user()
    if not current_user or current_user["role"] != "SUPER_ADMIN":
        return jsonify({"error": "Unauthorized"}), 403

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT role FROM admin WHERE id=%s", (uid,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # 1. Prevent self-deletion
    if current_user["id"] == uid:
        return jsonify({"error": "You cannot remove your own account."}), 400

    # 2. Only Super Admins can delete people
    if current_user["role"] != "SUPER_ADMIN":
        return jsonify({"error": "Permission denied. Only Super Admins can remove users."}), 403

    # Prevent deleting last super admin
    if user["role"] == "SUPER_ADMIN":
        cursor.execute("SELECT COUNT(*) AS cnt FROM admin WHERE role='SUPER_ADMIN'")
        if cursor.fetchone()["cnt"] == 1:
            return jsonify({"error": "Cannot delete last Super Admin"}), 403

    cursor.execute("DELETE FROM admin WHERE id=%s", (uid,))
    conn.commit()
    log_activity("Deleted Admin Account", f"UID: {uid}")

    cursor.close()
    conn.close()

    return jsonify({"status": "deleted"}), 200


@admin_users_bp.route("/admin/me", methods=["GET"])
def get_me():
    user = get_current_user() # Uses the function we already wrote
    if not user:
        return jsonify({"error": "Not logged in"}), 401
    
    # We need to fetch the name from the DB for the UI
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, role FROM admin WHERE id=%s", (user['id'],))
    data = cursor.fetchone()
    cursor.close()
    conn.close()
    
    return jsonify(data), 200


@admin_users_bp.route("/admin/users/<int:uid>/resend-invite", methods=["POST"])
def resend_invite(uid):
    current_user = get_current_user()

    if not current_user or current_user["role"] != "SUPER_ADMIN":
        return jsonify({"error": "Unauthorized"}), 403

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT name, email, status
        FROM admin
        WHERE id=%s
    """, (uid,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["status"] != "INVITED":
        return jsonify({"error": "Invite already accepted"}), 400

    # 🔐 Generate NEW token
    new_token = secrets.token_urlsafe(32)
    new_expiry = datetime.utcnow() + timedelta(hours=48)

    cursor.execute("""
        UPDATE admin
        SET invite_token=%s,
            invite_expires_at=%s
        WHERE id=%s
    """, (new_token, new_expiry, uid))

    conn.commit()
    cursor.close()
    conn.close()

    invite_link = f"http://localhost:5173/setup-password?token={new_token}"

    try:
        send_admin_invite(current_app, user["email"], user["name"], invite_link)
    except Exception as e:
        print("Resend invite email error:", e)

    return jsonify({"status": "resent"}), 200
