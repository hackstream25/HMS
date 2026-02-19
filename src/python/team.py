from flask import Blueprint, request, jsonify, session
from db import get_db_connection
import json

team = Blueprint("team", __name__, url_prefix="/team")


@team.route("/add", methods=["POST"])
def add_member():
    data = request.json or {}

    teamid = session.get("teamid") or data.get("teamid")
    name = data.get("name")

    if not teamid or not name:
        return jsonify({"error": "Team ID or name missing"}), 400

    db = get_db_connection()
    cur = db.cursor(dictionary=True)

    # 🔹 Get existing members
    cur.execute(
        "SELECT team_members FROM user WHERE teamid=%s",
        (teamid,)
    )
    row = cur.fetchone()

    members = []
    if row and row["team_members"]:
        members = json.loads(row["team_members"])

    # 🔒 max 3 members
    if len(members) >= 3:
        return jsonify({"error": "Maximum 3 members allowed"}), 400

    members.append(name)

    # 🔹 Update users table
    cur.execute(
        "UPDATE user SET team_members=%s WHERE teamid=%s",
        (json.dumps(members), teamid)
    )

    db.commit()
    cur.close()
    db.close()

    return jsonify({"status": "added", "members": members}), 200

