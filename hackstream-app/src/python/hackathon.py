from flask import Blueprint, jsonify
from db import get_db_connection

hackathon = Blueprint("hackathon", __name__)

@hackathon.route("/hackathon/config", methods=["GET"])
def hackathon_config():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            start_time,
            track,
            max_teams,
            prize_amount
        FROM hackathon_config
        LIMIT 1
    """)
    cfg = cursor.fetchone()

    cursor.execute("SELECT COUNT(*) AS registered FROM user")
    registered = cursor.fetchone()["registered"]

    cursor.close()
    conn.close()

    return jsonify({
        "startTime": cfg["start_time"],
        "track": cfg["track"],
        "maxTeams": cfg["max_teams"],
        "registered": registered,
        "prize": cfg["prize_amount"]
    })
