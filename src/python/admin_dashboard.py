from flask import Blueprint, jsonify
from db import get_db_connection

# Create the blueprint
admin_dashboard = Blueprint("admin_dashboard", __name__)

@admin_dashboard.route("/admin/dashboard-stats", methods=["GET"])
def get_dashboard_stats():
    conn = get_db_connection()
    cursor = conn.cursor()   # ✅ Normal tuple-based cursor

    try:
        # 1. Max Teams
        cursor.execute("SELECT max_teams FROM hackathon_config LIMIT 1")
        row = cursor.fetchone()
        team_limit = row[0] if row else 50

        # 2. Team Stats
        cursor.execute("SELECT status, COUNT(*) FROM teams GROUP BY status")
        team_rows = cursor.fetchall()

        approved_teams = 0
        pending_teams = 0

        for status, count in team_rows:
            status = status.lower()
            if status in ["approved", "evaluated"]:
                approved_teams += count
            elif status == "pending":
                pending_teams += count

        # 3. Judges Count
        cursor.execute("SELECT COUNT(*) FROM judge")
        judges_active = cursor.fetchone()[0]

        # 4. Submitted Projects
        cursor.execute("SELECT COUNT(*) FROM submissions WHERE status = 'SUBMITTED'")
        submitted_count = cursor.fetchone()[0]

        # 5. Evaluated Teams
        cursor.execute("SELECT COUNT(*) FROM teams WHERE is_evaluated = 1")
        evaluated_count = cursor.fetchone()[0]

        return jsonify({
            "teamLimit": team_limit,
            "approvedTeams": approved_teams,
            "pendingTeams": pending_teams,
            "judgesActive": judges_active,
            "submittedCount": submitted_count,
            "evaluatedCount": evaluated_count,
            "phase": "Registration Ongoing" if submitted_count == 0 else "Judging Phase"
        })

    except Exception as e:
        print("!!! DASHBOARD BACKEND ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()