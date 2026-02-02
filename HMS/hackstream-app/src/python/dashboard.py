from flask import Blueprint, jsonify
from db import get_db_connection
import json

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/dashboard/<team_id>", methods=["GET"])
def get_dashboard(team_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # TEAM INFO + TEAM MEMBERS (FROM USER TABLE)
    cursor.execute("""
        SELECT 
            teamid,
            team_name,
            name AS leader_name,
            status,
            team_members
        FROM user
        WHERE teamid = %s
    """, (team_id,))
    team = cursor.fetchone()

    # MEMBERS COUNT (leader + members array)
    members_count = 1
    team_members_list = []

    if team and team["team_members"]:
        team_members_list = json.loads(team["team_members"])
        members_count += len(team_members_list)

    conn.close()

    return jsonify({
        "team": {
            "teamid": team["teamid"],
            "team_name": team["team_name"],
            "leader_name": team["leader_name"],
            "status": team["status"],
            "team_members": team_members_list
        },
        "members": members_count
    })
