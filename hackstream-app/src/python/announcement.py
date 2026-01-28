from flask import Blueprint, jsonify
from db import get_db_connection

announcement_bp = Blueprint("announcement", __name__)

@announcement_bp.route("/announcements", methods=["GET"])
def get_announcements():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, message, created_at
        FROM announcements
        ORDER BY created_at DESC
    """)

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(data)
