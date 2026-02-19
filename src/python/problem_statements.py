from flask import Blueprint, request, jsonify
from db import get_db_connection
from datetime import datetime, timezone
import pytz
from logger_utils import log_activity

IST = pytz.timezone("Asia/Kolkata")
problem_bp = Blueprint("problem_statements", __name__)

def auto_publish_scheduled(cursor, conn):
    """Auto-publish scheduled PS but preserve publish_at for delay tracking"""
    cursor.execute("""
        UPDATE problem_statements
        SET status = 'published',
            published_at = UTC_TIMESTAMP()
        WHERE status = 'scheduled'
          AND publish_at IS NOT NULL
          AND publish_at <= UTC_TIMESTAMP()
          AND published_at IS NULL
    """)
    conn.commit()


@problem_bp.route("/admin/problem-statements", methods=["POST"])
def create_or_update_problem_statement():
    data = request.json
    ps_id = data.get("id")
    title = data.get("title")
    track = data.get("track")
    description = data.get("description")
    status = data.get("status", "draft")
    publish_at = data.get("publishAt")

    if not title or not track or not description:
        return jsonify({"message": "Missing required fields"}), 400

    publish_at_dt = None
    # Handle scheduling: Convert UI (IST) to UTC for DB storage
    # In your POST route
    if status == "scheduled" and publish_at:
        # 'publish_at' comes from UI as "YYYY-MM-DDTHH:MM"
        local_dt = datetime.fromisoformat(publish_at)
        # Treat it as IST, then convert to UTC for the database
        ist_dt = IST.localize(local_dt)
        publish_at_dt = ist_dt.astimezone(timezone.utc)

    published_at = None
    if status == "published":
        published_at = datetime.now(timezone.utc)
        

    conn = get_db_connection()
    cursor = conn.cursor()

    if ps_id:
        cursor.execute("""
            UPDATE problem_statements 
            SET title=%s, track=%s, description=%s, status=%s, publish_at=%s, published_at=%s 
            WHERE id=%s
        """, (title, track, description, status, publish_at_dt, published_at, ps_id))
    else:
        cursor.execute("""
            INSERT INTO problem_statements (title, track, description, status, publish_at, published_at) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (title, track, description, status, publish_at_dt, published_at))

    conn.commit()
    action = "Updated PS" if ps_id else "Created PS"
    log_activity(action, title)
    cursor.close()
    conn.close()
    return jsonify({"status": "success"}), 200

@problem_bp.route("/admin/problem-statements", methods=["GET"])
def get_all_problem_statements():
    conn = get_db_connection()
    cursor = conn.cursor()
    auto_publish_scheduled(cursor, conn)
    cursor.close()

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM problem_statements ORDER BY created_at DESC")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data), 200

@problem_bp.route("/admin/problem-statements/<int:pid>/publish", methods=["POST"])
def publish_now(pid):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE problem_statements
        SET status='published',
            published_at=UTC_TIMESTAMP()
        WHERE id=%s
          AND published_at IS NULL
    """, (pid,))
    conn.commit()
    log_activity("Published PS", f"ID: {pid}")
    cursor.close()
    conn.close()
    return jsonify({"status": "published"}), 200

@problem_bp.route("/admin/problem-statements/<int:pid>", methods=["DELETE"])
def delete_problem_statement(pid):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM problem_statements WHERE id=%s", (pid,))
    conn.commit()
    log_activity("Deleted PS", f"ID: {pid}")
    cursor.close()
    conn.close()
    return jsonify({"status": "deleted"}), 200

