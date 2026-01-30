@team.route("/add", methods=["POST"])
def add_member():
    teamid = session.get("teamid")
    data = request.json

    db = get_db_connection()
    cur = db.cursor()

    cur.execute("""
      INSERT INTO team_members (teamid,name,email,role)
      VALUES (%s,%s,%s,%s)
    """, (teamid, data["name"], data["email"], data["role"]))

    db.commit()
    return jsonify({"status": "added"})
