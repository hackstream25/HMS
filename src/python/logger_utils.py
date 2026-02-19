from flask import session
from db import get_db_connection

def log_activity(action, target):
    from db import get_db_connection
    # We only pull the name now
    actor_name = session.get("admin_name", "System")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO activity_logs (actor_name, action_type, target_name)
            VALUES (%s, %s, %s)
        """, (actor_name, action, target))
        conn.commit()
    except Exception as e:
        print(f"Logging Error: {e}")
    finally:
        cursor.close()
        conn.close()