from flask import Blueprint, request, jsonify
from db import get_db_connection
from datetime import datetime

submission = Blueprint("submission", __name__)

@submission.route("/submission", methods=["POST"])
def submit_project():
    data = request.get_json()

    teamid = data.get("teamid")
    title = data.get("title")
    description = data.get("description")
    problem_statement = data.get("problem_statement")
    tech_stack = data.get("tech_stack")
    github_link = data.get("github_link")
    demo_link = data.get("demo_link")
    video_link = data.get("video_link")

    if not teamid:
        return jsonify({"error": "Team ID missing"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO submissions
            (teamid, title, description, problem_statement, tech_stack,
             github_link, demo_link, video_link,
             status, submitted_at)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,'SUBMITTED',%s)
        """, (
            teamid, title, description, problem_statement, tech_stack,
            github_link, demo_link, video_link,
            datetime.now()
        ))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"status": "success"}), 200

    except Exception as e:
        print("SUBMISSION ERROR:", e)
        return jsonify({"error": "Submission failed"}), 500
