from flask import Blueprint, request, jsonify, session
from db import get_db_connection

judge_score_bp = Blueprint("judge_score_bp", __name__)

@judge_score_bp.route("/judge/submit-score", methods=["POST"])
def submit_score():
    judge_id = session.get("judge_id")
    if not judge_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.get_json()
    team_id = data.get("team_id")
    # This is the array of {rubric_id, score} from frontend
    score_entries = data.get("scores") 

    if not team_id or not score_entries:
        return jsonify({"error": "Missing team ID or scores"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # 1. Insert each rubric score into the database
        for item in score_entries:
            cursor.execute("""
                INSERT INTO judge_scores (judge_id, team_id, rubric_id, score)
                VALUES (%s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE score = VALUES(score)
            """, (judge_id, team_id, item['rubric_id'], item['score']))

        # 2. Update the team status to EVALUATED
        cursor.execute("""
            UPDATE teams 
            SET status = 'EVALUATED', is_evaluated = 1 
            WHERE id = %s
        """, (team_id,))

        conn.commit()
        return jsonify({"message": "Scores submitted and team evaluated!"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()