from flask import Blueprint, jsonify, request
from db import get_db_connection

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard/<team_id>", methods=["GET"])
def get_dashboard(team_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Team basic info
    cursor.execute("""
        SELECT teamid, team_name, name AS leader_name, status
        FROM user
        WHERE teamid = %s
    """, (team_id,))
    team = cursor.fetchone()

    # Members count
    cursor.execute("""
        SELECT COUNT(*) AS members
        FROM team_members
        WHERE teamid = %s
    """, (team_id,))
    members = cursor.fetchone()

    conn.close()

    return jsonify({
        "team": team,
        "members": members["members"]
    })
