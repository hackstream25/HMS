from flask import Blueprint, jsonify, request
from db import get_db_connection

judge_teams_bp = Blueprint("judge_teams", __name__)

@judge_teams_bp.route("/judge/teams", methods=["GET"])
def get_judge_teams():
    judge_id = request.args.get("judge_id")

    if not judge_id:
        return jsonify({"error": "judge_id required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            u.teamid,
            u.team_name,
            CASE 
                WHEN jt.status = 'EVALUATED' THEN 'EVALUATED'
                ELSE 'PENDING'
            END AS status
        FROM judge_team_assignments jta
        JOIN user u 
            ON jta.team_id = u.teamid
        LEFT JOIN judge_teams jt 
            ON jt.team_id = u.teamid
        WHERE jta.judge_id = %s
          AND u.status = 'APPROVED'
        GROUP BY u.teamid, u.team_name, jt.status
    """, (judge_id,))

    teams = cursor.fetchall()

    cursor.close()
    conn.close()

    response = []
    for idx, team in enumerate(teams, start=1):
        response.append({
            "id": idx,
            "teamid": team["teamid"],
            "team_name": team["team_name"],
            "status": team["status"]
        })

    return jsonify(response)
