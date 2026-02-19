from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash, generate_password_hash
from db import get_db_connection
from logger_utils import log_activity

admin_password_bp = Blueprint("admin_password", __name__)

def get_current_user():
    return session.get("admin")   # must contain id, role, force_password_change


@admin_password_bp.route("/admin/change-password", methods=["POST"])
def change_password():
    admin_id = session.get("admin_id")

    if not admin_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    new_password = data.get("password")

    if not new_password or len(new_password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    new_hash = generate_password_hash(new_password)

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE admin
        SET password=%s,
            force_password_change=0
        WHERE id=%s
    """, (new_hash, admin_id))

    conn.commit()
    log_activity("Security Change", "Admin changed own password")
    cursor.close()
    conn.close()

    # ✅ IMPORTANT: LOG OUT USER
    session.clear()

    return jsonify({"success": True, "loggedOut": True}), 200
