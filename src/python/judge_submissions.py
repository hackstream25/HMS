from flask import Blueprint, jsonify, session
from db import get_db_connection

judge_submissions_bp = Blueprint("judge_submissions", __name__)

@judge_submissions_bp.route("/judge/submission/<int:team_id>", methods=["GET"])
def get_submission(team_id):
    if "judge_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT 
                s.github_link,
                s.demo_link,
                s.video_link
            FROM submissions s
            JOIN teams t ON t.teamid = s.teamid
            WHERE t.id = %s
            LIMIT 1
        """, (team_id,))

        submission = cursor.fetchone()

        return jsonify(submission or {
            "github_link": None,
            "demo_link": None,
            "video_link": None
        }), 200

    finally:
        cursor.close()
        conn.close()

