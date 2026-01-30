from flask import Blueprint, request, jsonify, current_app,session
from db import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash
import random, datetime as date
import threading
from email_utils import send_team_email

auth = Blueprint("auth", __name__)

#---------SIGNUP_________
@auth.route("/signup", methods=["POST"])
def signup():
    data = request.json

    name = data.get("leaderName")
    team_name = data.get("teamName")
    email = data.get("email")
    phone = data.get("contactNumber")
    college = data.get("college")
    password = data.get("password")
    confirm_password = data.get("confirmPassword")

    if not all([name, team_name, email, phone, college, password, confirm_password]):
        return jsonify({"message": "Missing fields"}), 400

    if password != confirm_password:
        return jsonify({"message": "Passwords do not match"}), 400

    hashed_password = generate_password_hash(password)

    num = random.randint(1000, 9999)
    year = str(date.datetime.now().year)[-2:]
    teamid = f"HMS{num}{year}"

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO user
        (name, team_name, email, number, college, password, teamid, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, 'APPROVED')
    """, (name, team_name, email, phone, college, hashed_password, teamid))

    conn.commit()
    cursor.close()
    conn.close()

    app = current_app._get_current_object()
    threading.Thread(
        target=send_team_email,
        args=(app, email, name, teamid),
        daemon=True
    ).start()

    return jsonify({
        "status": "success",
        "teamId": teamid,
        "teamName": team_name
    }), 201


# ---------------- USER LOGIN ----------------
@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    teamid = data.get("teamId")
    password = data.get("password")

    if not teamid or not password:
        return jsonify({"error": "Missing credentials"}), 400

    db = get_db_connection()
    cur = db.cursor(dictionary=True)

    cur.execute("SELECT * FROM user WHERE teamid=%s", (teamid,))
    user = cur.fetchone()

    if not user:
        return jsonify({"error": "Invalid Team ID"}), 401

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid Password"}), 401

    # ✅ SESSION (NOW SAFE)
    session.clear()
    session["teamid"] = user["teamid"]
    session["team_name"] = user["team_name"]
    session["leader"] = user["name"]

    return jsonify({
        "status": "success",
        "teamId": user["teamid"],
        "teamName": user["team_name"],
        "leader": user["name"]
    }), 200


# ---------------- ADMIN LOGIN ----------------
@auth.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()

    email = data.get("email")
    number = data.get("contactNumber")
    password = data.get("password")

    if not email or not number or not password:
        return jsonify({"message": "Missing fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT name, email, password
        FROM admin
        WHERE email=%s AND number=%s
    """, (email, number))

    admin = cursor.fetchone()
    cursor.close()
    conn.close()

    if not admin or not check_password_hash(admin["password"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    return jsonify({
        "status": "success",
        "admin": {
            "name": admin["name"],
            "email": admin["email"]
        }
    }), 200
