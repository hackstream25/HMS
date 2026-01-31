from flask import Blueprint, jsonify, session
from db import get_db_connection

judge_overview_bp = Blueprint("judge_overview", __name__)

@judge_overview_bp.route("/judge/overview", methods=["GET"])
def judge_overview():
    if "judge_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Total assigned teams
    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM teams
        WHERE assigned_judge_id = %s
    """, (session["judge_id"],))
    total = cursor.fetchone()["total"]

    # Evaluated teams
    cursor.execute("""
        SELECT COUNT(*) AS evaluated
        FROM teams
        WHERE assigned_judge_id = %s
          AND is_evaluated = 1
    """, (session["judge_id"],))
    evaluated = cursor.fetchone()["evaluated"]

    cursor.close()
    conn.close()

    return jsonify({
        "teams_registered": total,
        "pending_reviews": total - evaluated,
        "finalists_selected": evaluated
    })
