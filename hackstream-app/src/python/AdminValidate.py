from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db_connection

app = Flask(__name__)
CORS(app)  # allow React requests

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask API running 🔥"})

@app.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json

    email = data.get("email")
    number = data.get("contactNumber")
    password = data.get("password")

    if not email or not number or not password:
        return jsonify({"error": "Missing fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT name, email
        FROM admin
        WHERE email = %s
          AND number = %s
          AND password = %s
    """

    cursor.execute(query, (email, number, password))
    admin = cursor.fetchone()

    cursor.close()
    conn.close()

    if not admin:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "status": "success",
        "message": "Admin login successful",
        "admin": admin
    })
    
if __name__ == "__main__":
    app.run(debug=True, port=8000)
