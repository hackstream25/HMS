from flask import Blueprint, request, jsonify
from db import get_db_connection

judge_score_bp = Blueprint("judge_score_bp", __name__)

@judge_score_bp.route("/judge/score", methods=["POST"])
def submit_score():
    data = request.get_json()

    team_id = data.get("team_id")
    team_name = data.get("team_name")
    title = data.get("title")
    tech_stack = data.get("tech_stack")
    score = data.get("score")

    if not team_id or score is None:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO judge_teams
        (team_id, team_name, title, status, tech_stack, score)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        team_id,
        team_name,
        "title",
        #title,
        "EVALUATED",
        "AI/ML",
        #tech_stack,
        score
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Score submitted successfully"}), 200
