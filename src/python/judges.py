from flask import Blueprint, request, jsonify, current_app, session
from db import get_db_connection
from email_utils import send_judge_invite
import secrets 
from datetime import datetime, timedelta, timezone
from werkzeug.security import generate_password_hash, check_password_hash
import json
from logger_utils import log_activity

# Named "judges_api" to avoid any conflict with "admin_users"
judges_bp = Blueprint("judges_api", __name__)

# def log_activity(action, target):
#     """Utility to record admin actions in the activity_logs table"""
#     from db import get_db_connection
#     actor_name = session.get("admin_name", "Unknown Admin")
#     actor_role = "Super Admin" if session.get("role") == "SUPER_ADMIN" else "Admin"

#     conn = get_db_connection()
#     cursor = conn.cursor()
#     try:
#         cursor.execute("""
#             INSERT INTO activity_logs (actor_name, actor_role, action_type, target_name)
#             VALUES (%s, %s, %s, %s)
#         """, (actor_name, actor_role, action, target))
#         conn.commit()
#     except Exception as e:
#         print(f"Logging Error: {e}")
#     finally:
#         cursor.close()
#         conn.close()

# --- 1. GET ALL JUDGES ---
@judges_bp.route("/admin/judges", methods=["GET"])
def get_judges():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, name, email, status FROM judge")
        judges = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(judges), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- 2. GET ALL TEAMS ---
# --- 2. GET ALL TEAMS (Modified) ---
@judges_bp.route("/admin/teams", methods=["GET"])
def get_teams():
    if not session.get("admin_id"):
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT 
                id, 
                team_name AS name, 
                track AS category, 
                assigned_judge_id AS assignedJudge,
                status,
                is_evaluated AS reviewed
            FROM teams
        """)
        teams = cursor.fetchall()
        return jsonify(teams), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- 3. INVITE JUDGE ---
@judges_bp.route("/admin/judges", methods=["POST"])
def add_judge():
    data = request.json
    name = data.get("name")
    email = data.get("email")

    if not session.get("admin_id"):
        return jsonify({"error": "Unauthorized. Please log in."}), 401

    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(hours=48)
    

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO judge (name, email, status, invite_token, invite_expires_at)
            VALUES (%s, %s, 'INVITED', %s, %s)
        """, (name, email, token, expires_at))
        conn.commit()
    except Exception as e:
        return jsonify({"error": "Judge already exists"}), 409
    finally:
        cursor.close()
        conn.close()

    invite_link = f"http://localhost:5173/setup-password/judge?token={token}"
    try:
        send_judge_invite(current_app, email, name, invite_link)
    except Exception as e:
        print(f"Mail error: {e}")
    log_activity("Invited Judge", name)
    return jsonify({"message": "Invited"}), 201

# --- 4. DELETE A JUDGE ---
@judges_bp.route("/admin/judges/<int:jid>", methods=["DELETE", "OPTIONS"])
def delete_judge(jid):
    if request.method == "OPTIONS":
        return "", 200

    if not session.get("admin_id"):
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM judge WHERE id=%s", (jid,))
        conn.commit()
        log_activity("Deleted Judge", f"Judge ID: {jid}")
        return jsonify({"message": "Judge deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
        
# --- 5. ASSIGN / UNASSIGN TEAM ---
@judges_bp.route("/admin/assign-team", methods=["POST", "OPTIONS"])
def assign_team():
    if request.method == "OPTIONS":
        return "", 200

    if not session.get("admin_id"):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    team_id = data.get("teamId")
    judge_id = data.get("judgeId") 

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE teams 
            SET assigned_judge_id = %s 
            WHERE id = %s
        """, (judge_id, team_id))
        conn.commit()
        log_activity("Assigned Team", f"Team {team_id} to Judge {judge_id}")
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- 6. GET JUDGE INFO BY TOKEN (For Setup Page) ---
@judges_bp.route("/judge/invite-info/<token>", methods=["GET"])
def get_judge_invite_info(token):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT name, email FROM judge 
            WHERE invite_token = %s AND invite_expires_at > NOW()
        """, (token,))
        judge = cursor.fetchone()
        if not judge:
            return jsonify({"error": "Invalid or expired token"}), 400
        return jsonify(judge), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- 7. SETUP JUDGE PASSWORD (Activate Account) ---
@judges_bp.route("/judge/setup-password", methods=["POST"])
def setup_judge_password():
    data = request.json
    token = data.get("token")
    password = data.get("password")
    
    if not token or not password:
        return jsonify({"error": "Token and password required"}), 400

    hashed_pw = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Update password, set status to ACTIVE, and clear the token
        cursor.execute("""
            UPDATE judge 
            SET password = %s, status = 'ACTIVE', invite_token = NULL 
            WHERE invite_token = %s AND invite_expires_at > NOW()
        """, (hashed_pw, token))
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Invalid or expired link"}), 400
            
        conn.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- 8. JUDGE LOGIN ---
# --- 8. JUDGE LOGIN in judges.py ---
@judges_bp.route("/judge/login", methods=["POST"])
def judge_login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, name, password
        FROM judge
        WHERE email=%s AND status='ACTIVE'
    """, (email,))
    judge = cursor.fetchone()

    if not judge or not check_password_hash(judge["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    session["judge_id"] = judge["id"]

    return jsonify({
        "message": "Login successful",
        "name": judge["name"]
    }), 200

# --- 9. GET TEAMS ASSIGNED TO LOGGED-IN JUDGE ---
@judges_bp.route("/judge/teams", methods=["GET"])
def get_judge_teams():
    judge_id = session.get("judge_id")
    
    if not judge_id:
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # We query your 'teams' table directly. 
        # No JOIN needed because assigned_judge_id is right there.
        cursor.execute("""
            SELECT 
                id, 
                team_name, 
                track, 
                status,
                is_evaluated
            FROM teams
            WHERE assigned_judge_id = %s
        """, (judge_id,))
        
        teams = cursor.fetchall()
        
        # We process the data so the frontend gets a consistent 'status'
        response = []
        for team in teams:
            response.append({
                "id": team["id"],
                "team_name": team["team_name"],
                "track": team["track"] or "N/A",
                # If is_evaluated is 1, force status to EVALUATED
                "status": "EVALUATED" if team["is_evaluated"] == 1 else team["status"].upper()
            })
                
        return jsonify(response), 200
    except Exception as e:
        # This will print the error in your terminal so you can see it
        print(f"DATABASE ERROR: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500
    finally:
        cursor.close()
        conn.close()
@judges_bp.route("/judge/me", methods=["GET"])

def judge_me():
    if "judge_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify({
        "judge_id": session["judge_id"]
    }), 200

@judges_bp.route("/judge/logout", methods=["POST"])
def judge_logout():
    session.pop("judge_id", None)
    return jsonify({"message": "Logged out"}), 200

# --- 10. GET RUBRICS ---
@judges_bp.route("/judge/rubrics", methods=["GET"])
def get_rubrics():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id, name, max_score FROM rubrics")
        return jsonify(cursor.fetchall()), 200
    finally:
        cursor.close()
        conn.close()

# --- 11. GET EXISTING SCORES FOR A TEAM ---
@judges_bp.route("/judge/team-scores/<int:team_id>", methods=["GET"])
def get_team_scores(team_id):
    judge_id = session.get("judge_id")
    if not judge_id: return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # Pulls rubric info + any score this specific judge gave this specific team
        query = """
            SELECT r.id as rubric_id, r.name, r.max_score, IFNULL(js.score, 0) as current_score
            FROM rubrics r
            LEFT JOIN judge_scores js ON r.id = js.rubric_id 
            AND js.team_id = %s AND js.judge_id = %s
        """
        cursor.execute(query, (team_id, judge_id))
        return jsonify(cursor.fetchall()), 200
    finally:
        cursor.close()
        conn.close()

# --- 12. FINAL SUBMISSION (LOCKED) ---
@judges_bp.route("/judge/submit-score", methods=["POST"])
def submit_score():
    judge_id = session.get("judge_id")
    if not judge_id: return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    team_id = data.get("team_id")
    score_entries = data.get("scores") 

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        total_score = 0
        for item in score_entries:
            cursor.execute("""
                INSERT INTO judge_scores (judge_id, team_id, rubric_id, score)
                VALUES (%s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE score = VALUES(score)
            """, (judge_id, team_id, item['rubric_id'], item['score']))
            total_score += int(item['score'])

        # Update the team status to EVALUATED and sync the total score
        cursor.execute("""
            UPDATE teams 
            SET status = 'EVALUATED', is_evaluated = 1, score = %s, evaluated_at = NOW()
            WHERE id = %s
        """, (total_score, team_id))

        conn.commit()
        return jsonify({"message": "Scores locked!", "total": total_score}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- 13. GET JUDGE ANNOUNCEMENTS ---
@judges_bp.route("/judge/announcements", methods=["GET"]) 
def get_judge_announcements():
    if not session.get("judge_id"):
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) 
    
    try:
        # We only care about published items meant for judges
        query = """
            SELECT id, title, message, published_at 
            FROM announcements 
            WHERE status = 'published' AND show_to_judges = 1
            ORDER BY published_at DESC
        """
        cursor.execute(query)
        rows = cursor.fetchall()

        # Clean date formatting for the frontend
        for row in rows:
            if row['published_at']:
                row['published_at'] = row['published_at'].strftime('%Y-%m-%d %H:%M:%S')

        return jsonify(rows), 200

    except Exception as e:
        print(f"DB ERROR: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    finally:
        cursor.close()
        conn.close()
        
@judges_bp.route("/judge/change-password", methods=["POST"])
def judge_change_password():
    judge_id = session.get("judge_id")
    if not judge_id:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    new_password = data.get("password")

    if not new_password or len(new_password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    hashed = generate_password_hash(new_password)

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE judge SET password=%s WHERE id=%s",
            (hashed, judge_id)
        )
        conn.commit()
        log_activity("Changed Password", f"Judge ID: {judge_id}")
    finally:
        cursor.close()
        conn.close()

    # 🔥 FORCE LOGOUT (VERY IMPORTANT)
    session.clear()

    return jsonify({
        "success": True,
        "loggedOut": True
    }), 200


@judges_bp.route("/admin/global-reviews", methods=["GET"])
def get_global_reviews():
    if not session.get("admin_id"):
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # 1️⃣ REMOVED the extra comma after j.id AS judge_id
        cursor.execute("""
            SELECT 
                t.id AS team_id,
                t.team_name,
                t.score AS total_score,
                t.evaluated_at,
                j.name AS judge_name,
                j.id AS judge_id
            FROM teams t
            JOIN judge j ON j.id = t.assigned_judge_id
            WHERE t.is_evaluated = 1
        """)
        teams = cursor.fetchall()

        results = []
        for team in teams:
            
            cursor.execute("""
                SELECT 
                    r.name,
                    js.score,
                    r.max_score
                FROM judge_scores js
                JOIN rubrics r ON r.id = js.rubric_id
                WHERE js.team_id = %s
            """, (team["team_id"],))

            rubrics = cursor.fetchall()

            results.append({
                "teamId": team["team_id"],
                "teamName": team["team_name"],
                "evaluatedAt": team["evaluated_at"].strftime('%Y-%m-%d %H:%M:%S') if team["evaluated_at"] else None,
                "judgeName": team["judge_name"],
                "judgeId": team["judge_id"],
                "totalScore": team["total_score"],
                "rubrics": rubrics
            })

        return jsonify(results), 200

    except Exception as e:
        print(f"Error in global-reviews: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
    finally:
        cursor.close()
        conn.close()
        
@judges_bp.route("/admin/activity-logs", methods=["GET"])
def get_activity_logs():
    # 🔒 Security Check
    if not session.get("admin_id") or session.get("role") != "SUPER_ADMIN":
        return jsonify({"error": "Unauthorized. Super Admin access required."}), 403

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Fetch logs ordered by newest first
        cursor.execute("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 100")
        logs = cursor.fetchall()

        formatted_logs = []
        for log in logs:
            formatted_logs.append({
                "id": log["id"],
                "actor": log["actor_name"],
                "action": log["action_type"],
                "target": log["target_name"],
                "time": log["created_at"].isoformat()
            })

        return jsonify(formatted_logs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()