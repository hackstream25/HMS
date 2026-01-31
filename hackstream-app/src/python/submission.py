from flask import Blueprint, request, jsonify
from db import get_db_connection

submission_bp = Blueprint("submission", __name__)



@submission_bp.route("/api/submissions", methods=["POST"])
def submit_project():
    data = request.json

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO submissions
        (teamid, teamname, title, description, techstack, github, demo)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """, (
        data["teamid"],
        data["teamname"],
        data["title"],
        data["description"],
        data["techStack"],
        data["github"],
        data["demo"]
    ))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"status": "submitted"}), 201
