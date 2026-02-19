from flask import Blueprint, request, jsonify, session
from db import get_db_connection

judge_rubric_bp = Blueprint("judge_rubric_bp", __name__)


# 1️⃣ GET ALL RUBRICS
@judge_rubric_bp.route("/judge/rubrics", methods=["GET"])
def get_rubrics():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, max_score FROM rubrics")
    rubrics = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rubrics), 200



# 2️⃣ SUBMIT RUBRIC SCORES (LOCKED)
@judge_rubric_bp.route("/judge/submit-score", methods=["POST"])
def submit_rubric_scores():
    judge_id = session.get("judge_id")
    if not judge_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    team_id = data.get("team_id")
    scores = data.get("scores")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Check if already evaluated
        cursor.execute("SELECT is_evaluated FROM teams WHERE id=%s AND assigned_judge_id=%s", (team_id, judge_id))
        team = cursor.fetchone()

        if not team:
            return jsonify({"error": "Team not found or not assigned to you"}), 404
        if team["is_evaluated"]:
            return jsonify({"error": "This team has already been evaluated"}), 403

        total = 0
        for s in scores:
            cursor.execute("""
                INSERT INTO judge_scores (judge_id, team_id, rubric_id, score)
                VALUES (%s,%s,%s,%s)
                ON DUPLICATE KEY UPDATE score = VALUES(score)
            """, (judge_id, team_id, s["rubric_id"], s["score"]))
            total += int(s["score"])

        # Update the team record
        cursor.execute("""
            UPDATE teams
            SET score=%s, is_evaluated=1, evaluated_at=NOW(), status='EVALUATED'
            WHERE id=%s
        """, (total, team_id))

        conn.commit()
        return jsonify({"success": True, "total_score": total}), 200

    except Exception as e:
        conn.rollback()
        print(f"Error submitting score: {e}") # Check your terminal for this!
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()