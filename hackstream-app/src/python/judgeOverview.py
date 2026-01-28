from flask import Blueprint, jsonify
from db import get_db_connection

judge_overview_bp = Blueprint("judge_overview", __name__)

@judge_overview_bp.route("/judge/overview", methods=["GET"])
def judge_overview():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # 1️⃣ Teams Registered (APPROVED users)
    cursor.execute("""
        SELECT COUNT(DISTINCT teamid) AS total_approved
        FROM user
        WHERE status = 'APPROVED'
          AND teamid IS NOT NULL
    """)
    total_approved = cursor.fetchone()["total_approved"]

    # 2️⃣ Evaluated Teams
    cursor.execute("""
        SELECT COUNT(DISTINCT team_id) AS evaluated
        FROM judge_teams
        WHERE status = 'EVALUATED'
    """)
    evaluated = cursor.fetchone()["evaluated"]

    cursor.close()
    conn.close()

    pending = total_approved - evaluated
    if pending < 0:
        pending = 0

    return jsonify({
        "teams_registered": total_approved,
        "submissions_received": 41,  # static (as requested)
        "pending_reviews": pending,
        "finalists_selected": evaluated
    })
