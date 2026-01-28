from flask import Blueprint, request, jsonify
from db import get_db_connection

judge_auth = Blueprint("judge_auth", __name__)

@judge_auth.route("/judge/login", methods=["POST"])
def judge_login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT judge_id, email, password FROM judge WHERE email = %s",
        (email,)
    )
    judge = cursor.fetchone()

    cursor.close()
    conn.close()

    if not judge:
        return jsonify({"error": "Invalid email or password"}), 401

    # ✅ PLAIN PASSWORD CHECK (OK for now)
    if judge["password"] == password:
        return jsonify({
            "message": "Login successful",
            "judge_id": judge["judge_id"]
        }), 200

    return jsonify({"error": "Invalid email or password"}), 401
