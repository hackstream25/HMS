from flask import Blueprint, request, jsonify
from db import get_db_connection

sync_bp = Blueprint("sync_bp", __name__)

@sync_bp.route("/api/google-form-sync", methods=["POST"])
def sync_google_form():
    data = request.json
    print("--- NEW ATTEMPT RECEIVED ---")
    print(data) # This will show us what Google sent in your terminal
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # 1. Insert into 'teams' table
        # We leave out 'id' because it is auto_increment
        cursor.execute("""
            INSERT INTO teams (teamid, team_name, leader_email, college, education, year, transaction_id, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'pending')
        """, (
            data.get('teamid'), 
            data.get('team_name'), 
            data.get('leader_email'), 
            data.get('college'), 
            data.get('education'), 
            data.get('year'), 
            data.get('transaction_id')
        ))
        
        # 2. Insert into 'team_members' table
        for member in data.get('members', []):
            # Only insert if the name is not empty or a dash
            if member.get('name') and member.get('name') != "-":
                cursor.execute("""
                    INSERT INTO team_members (teamid, name, email, role)
                    VALUES (%s, %s, %s, %s)
                """, (data.get('teamid'), member.get('name'), member.get('email'), member.get('role')))
            
        conn.commit()
        print("Successfully saved to Database!")
        return jsonify({"message": "Registration received successfully!"}), 201

    except Exception as e:
        conn.rollback()
        print(f"!!! DATABASE ERROR: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()