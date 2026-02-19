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
    # 1. Authorization check
    if not session.get("admin_id"):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    new_limit = data.get("maxTeams")

    if new_limit is None:
        return jsonify({"error": "Missing maxTeams value"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # 2. Update the configuration limit
        cursor.execute("UPDATE hackathon_config SET max_teams = %s WHERE id = 1", (new_limit,))

        # 3. PROMOTION LOGIC: Move teams from Waiting -> Approved if space opened up
        # First, count how many are currently approved
        cursor.execute("SELECT COUNT(*) as count FROM teams WHERE LOWER(status) = 'approved'")
        current_approved = cursor.fetchone()['count']

        available_slots = int(new_limit) - current_approved

        if available_slots > 0:
            # Fetch the teams currently in 'waiting' status
            # We sort by id (or registration date if you have it) to be fair (First In, First Out)
            cursor.execute("""
                SELECT id FROM teams 
                WHERE LOWER(status) = 'waiting' 
                ORDER BY id ASC 
                LIMIT %s
            """, (available_slots,))
            
            teams_to_promote = cursor.fetchall()

            if teams_to_promote:
                promote_ids = [t['id'] for t in teams_to_promote]
                placeholders = ', '.join(['%s'] * len(promote_ids))
                
                # Execute the promotion
                cursor.execute(f"""
                    UPDATE teams 
                    SET status = 'approved' 
                    WHERE id IN ({placeholders})
                """, promote_ids)
                
                promotion_count = len(promote_ids)
            else:
                promotion_count = 0
        else:
            promotion_count = 0

        conn.commit()
        return jsonify({
            "success": True, 
            "message": f"Config updated. {promotion_count} teams promoted to Approved."
        }), 200

    except Exception as e:
        conn.rollback()
        print(f"Update Config Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()