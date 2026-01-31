from flask import Blueprint, jsonify, session, request
from db import get_db_connection

hackathon = Blueprint("hackathon", __name__)

@hackathon.route("/hackathon/config", methods=["GET"])
def hackathon_config():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Match the column names from your DESCRIBE table output
        cursor.execute("""
            SELECT 
                event_name,
                start_time,
                max_teams,
                prize_pool,
                track
            FROM hackathon_config
            LIMIT 1
        """)
        cfg = cursor.fetchone()

        if not cfg:
            # Fallback values if the table is empty
            return jsonify({
                "eventName": "Hackathon",
                "startTime": None,
                "maxTeams": 50,
                "prizePool": "TBD",
                "track": "General"
            })

        # Get registered user count
        cursor.execute("SELECT COUNT(*) AS registered FROM user")
        registered = cursor.fetchone()["registered"]

        return jsonify({
            "eventName": cfg["event_name"],
            "startTime": cfg["start_time"],
            "maxTeams": cfg["max_teams"],
            "prizePool": cfg["prize_pool"], # Updated column name
            "track": cfg["track"],
            "registered": registered
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@hackathon.route("/admin/update-config", methods=["POST"])
def update_config():
    if not session.get("admin_id"):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    new_limit = int(data.get("maxTeams", 0))

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # 1. Update the limit in config
        cursor.execute("UPDATE hackathon_config SET max_teams = %s WHERE id = 1", (new_limit,))

        # 2. Get current approved teams (Ordered by ID so the LATEST ones are last)
        cursor.execute("SELECT id FROM teams WHERE LOWER(status) = 'approved' ORDER BY id ASC")
        approved_teams = cursor.fetchall()
        current_count = len(approved_teams)

        if current_count > new_limit:
            # --- DEMOTION LOGIC ---
            # We have too many approved teams. Move the NEWEST ones to waiting.
            to_demote = approved_teams[new_limit:] # Get everyone past the new limit
            demote_ids = [t['id'] for t in to_demote]
            
            placeholders = ', '.join(['%s'] * len(demote_ids))
            cursor.execute(f"UPDATE teams SET status = 'waiting' WHERE id IN ({placeholders})", demote_ids)
            message = f"Limit decreased. {len(demote_ids)} teams moved to Waiting."

        elif current_count < new_limit:
            # --- PROMOTION LOGIC ---
            # We have extra space. Move oldest Waiting teams to Approved.
            available_slots = new_limit - current_count
            cursor.execute("SELECT id FROM teams WHERE LOWER(status) = 'waiting' ORDER BY id ASC LIMIT %s", (available_slots,))
            to_promote = cursor.fetchall()

            if to_promote:
                promote_ids = [t['id'] for t in to_promote]
                placeholders = ', '.join(['%s'] * len(promote_ids))
                cursor.execute(f"UPDATE teams SET status = 'approved' WHERE id IN ({placeholders})", promote_ids)
                message = f"Limit increased. {len(promote_ids)} teams promoted to Approved."
            else:
                message = "Limit increased, but no teams were in the waiting list."
        else:
            message = "Limit updated, no status changes required."

        conn.commit()
        return jsonify({"success": True, "message": message}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()