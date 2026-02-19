from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from datetime import datetime,timezone

from db import get_db_connection

admin_invite_bp = Blueprint("admin_invite", __name__)

@admin_invite_bp.route("/admin/invite/<token>", methods=["GET"])
def verify_invite(token):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, email, name, status, invite_expires_at
        FROM admin
        WHERE invite_token=%s
    """, (token,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return jsonify({"error": "Invalid invite"}), 404

    if user["status"] != "INVITED":
        return jsonify({"error": "Invite already used"}), 400
    
    now = datetime.now(timezone.utc).replace(tzinfo=None)

    if now > user["invite_expires_at"]:
        return jsonify({"error": "Invite expired"}), 400
    return jsonify({
        "email": user["email"],
        "name": user["name"]
    })


@admin_invite_bp.route("/invite/setup/<token>", methods=["POST"])
def setup_password(token):
    data = request.json
    password = data.get("password")
    user_type = data.get("type") # Must be 'admin' or 'judge'

    if not password or len(password) < 6:
        return jsonify({"error": "Password too short"}), 400

    # Safety check for table name
    table = "admin" if user_type == "admin" else "judge"
    password_hash = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if the token exists in that table first
        cursor.execute(f"SELECT id FROM {table} WHERE invite_token=%s", (token,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"error": "Invalid or expired token for this user type"}), 404

        cursor.execute(f"""
            UPDATE {table} 
            SET password=%s, 
                status='ACTIVE', 
                force_password_change=0, 
                invite_token=NULL, 
                invite_expires_at=NULL 
            WHERE invite_token=%s
        """, (password_hash, token))
        
        conn.commit()
        return jsonify({"success": True, "message": f"{user_type.capitalize()} account activated!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
        
        
# Add this to your Flask admin_invite_bp file
@admin_invite_bp.route("/admin/internal-reset", methods=["POST"])
def internal_reset():
    data = request.json
    admin_id = data.get("adminId")
    password = data.get("password")

    if not admin_id or not password:
        return jsonify({"error": "Missing Admin ID or Password"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        hashed = generate_password_hash(password)
        # Update the admin and clear BOTH flags (token and force change)
        cursor.execute("""
            UPDATE admin 
            SET password=%s, force_password_change=0, status='ACTIVE', invite_token=NULL 
            WHERE id=%s
        """, (hashed, admin_id))
        
        conn.commit()
        return jsonify({"success": True, "message": "Password updated!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()