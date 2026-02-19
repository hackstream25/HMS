from flask import Blueprint, request, jsonify, session
from db import get_db_connection
from logger_utils import log_activity

teams_bp = Blueprint("teams_bp", __name__)

@teams_bp.route("/admin/teams/all", methods=["GET"])
def get_all_teams():
    if not session.get("admin_id"):
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    # We fetch the REAL count from the members table instead of the 'members_count' column
    query = """
    SELECT t.*, 
    (SELECT name FROM team_members WHERE teamid = t.teamid AND role = 'Leader' LIMIT 1) as leader_name,
    (SELECT GROUP_CONCAT(name SEPARATOR ', ') FROM team_members WHERE teamid = t.teamid) as all_member_names,
    (SELECT COUNT(*) FROM team_members WHERE teamid = t.teamid) as actual_member_count
    FROM teams t
    """
    cursor.execute(query)
    teams = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(teams), 200

@teams_bp.route("/admin/teams/status", methods=["POST"])
def update_team_status():
    if not session.get("admin_id"):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    team_ids = data.get("ids", []) 
    new_status = data.get("status", "").upper()

    if not team_ids:
        return jsonify({"error": "No teams selected"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        if new_status == 'APPROVED':
            # 1. Get current limit
            cursor.execute("SELECT max_teams FROM hackathon_config LIMIT 1")
            config = cursor.fetchone()
            max_teams = config['max_teams'] if config else 50

            # 2. Check how many are currently approved
            cursor.execute("SELECT COUNT(*) as count FROM teams WHERE UPPER(status) = 'APPROVED'")
            current_count = cursor.fetchone()['count']
            
            available_slots = max_teams - current_count

            # 3. Handle Transitions
            if available_slots <= 0:
                # All selected move to waiting
                placeholders = ', '.join(['%s'] * len(team_ids))
                cursor.execute(f"UPDATE teams SET status = 'waiting' WHERE id IN ({placeholders})", team_ids)
                message = f"{len(team_ids)} teams moved to Waiting List (Limit reached)"
            elif len(team_ids) > available_slots:
                # Fill available slots, move rest to waiting
                to_approve = team_ids[:available_slots]
                to_wait = team_ids[available_slots:]
                
                # Update Approved
                p1 = ', '.join(['%s'] * len(to_approve))
                cursor.execute(f"UPDATE teams SET status = 'approved' WHERE id IN ({p1})", to_approve)
                
                # Update Waiting
                p2 = ', '.join(['%s'] * len(to_wait))
                cursor.execute(f"UPDATE teams SET status = 'waiting' WHERE id IN ({p2})", to_wait)
                message = f"{len(to_approve)} Approved, {len(to_wait)} moved to Waiting List"
            else:
                # All fit in the limit
                placeholders = ', '.join(['%s'] * len(team_ids))
                cursor.execute(f"UPDATE teams SET status = 'approved' WHERE id IN ({placeholders})", team_ids)
                message = f"Successfully approved {len(team_ids)} teams"
        else:
            # For other statuses like REJECTED or PENDING
            placeholders = ', '.join(['%s'] * len(team_ids))
            cursor.execute(f"UPDATE teams SET status = %s WHERE id IN ({placeholders})", [new_status] + team_ids)
            message = f"Updated {len(team_ids)} teams to {new_status}"

        conn.commit()
        log_activity("Bulk Status Update", f"{len(team_ids)} teams to {new_status}")
        return jsonify({"message": message}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()