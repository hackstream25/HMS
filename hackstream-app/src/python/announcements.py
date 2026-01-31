from flask import Blueprint, request, jsonify
from db import get_db_connection
from datetime import datetime, timezone
import pytz
from logger_utils import log_activity

IST = pytz.timezone("Asia/Kolkata")
announcement_bp = Blueprint("announcements", __name__)

# ---------------- AUTO PUBLISH ----------------
def auto_publish_announcements(cursor, conn):
    now_utc = datetime.now(timezone.utc)

    cursor.execute("""
        SELECT id, publish_at
        FROM announcements
        WHERE status='scheduled'
          AND publish_at IS NOT NULL
    """)

    rows = cursor.fetchall()

    for aid, publish_at in rows:
        # MySQL returns naive datetime → treat as UTC
        publish_at_utc = publish_at.replace(tzinfo=timezone.utc)

        if publish_at_utc <= now_utc:
            cursor.execute("""
                UPDATE announcements
                SET status='published',
                    published_at=%s
                WHERE id=%s
            """, (now_utc, aid))

    conn.commit()



# ---------------- GET ALL ----------------
@announcement_bp.route("/admin/announcements", methods=["GET"])
def get_all_announcements():
    try:
        conn = get_db_connection()

        # Auto-publish first
        cursor = conn.cursor()
        auto_publish_announcements(cursor, conn)
        cursor.close()

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM announcements ORDER BY id DESC")
        data = cursor.fetchall()
        cursor.close()
        conn.close()

        for item in data:
            # created_at
            if item.get("created_at"):
                item["created_at"] = item["created_at"].isoformat()

            # publish_at (NULL SAFE)
            if item.get("publish_at"):
                item["publish_at"] = item["publish_at"].replace(
                    tzinfo=timezone.utc
                ).isoformat()
            else:
                item["publish_at"] = None

            # published_at (NULL SAFE)
            if item.get("published_at"):
                item["published_at"] = item["published_at"].replace(
                    tzinfo=timezone.utc
                ).isoformat()
            else:
                item["published_at"] = None

            # Build visibility object from columns
            item["visibility"] = {
                "admins": bool(item.get("show_to_admins")),
                "judges": bool(item.get("show_to_judges")),
                "teams": bool(item.get("show_to_teams")),
                "public": bool(item.get("show_to_public")),
            }

        return jsonify(data), 200

    except Exception as e:
        print("ERROR FETCHING ANNOUNCEMENTS:", e)
        return jsonify({"error": str(e)}), 500


# ---------------- CREATE / UPDATE ----------------
@announcement_bp.route("/admin/announcements", methods=["POST"])
def create_or_update_announcement():
    data = request.json or {}
    ann_id = data.get("id")

    title = data.get("title")
    message = data.get("message")
    status = data.get("status", "draft")

    # Visibility mapping
    visibility = data.get("visibility", {})
    show_to_admins = int(visibility.get("admins", False))
    show_to_judges = int(visibility.get("judges", False))
    show_to_teams  = int(visibility.get("teams", False))
    show_to_public = int(visibility.get("public", False))

    # Publish datetime (SAFE)
    publish_at_raw = data.get("publishAt")
    publish_at_dt = None

    if status == "scheduled" and publish_at_raw:
        try:
            local_dt = datetime.strptime(publish_at_raw, "%Y-%m-%dT%H:%M")
            ist_dt = IST.localize(local_dt)
            publish_at_dt = ist_dt.astimezone(timezone.utc)
        except Exception:
            publish_at_dt = None

    conn = get_db_connection()
    cursor = conn.cursor()

    # Prevent editing published announcements
    if ann_id:
        cursor.execute("SELECT status FROM announcements WHERE id=%s", (ann_id,))
        row = cursor.fetchone()
        if row and row[0] == "published":
            cursor.close()
            conn.close()
            return jsonify({"error": "Published announcements cannot be edited"}), 403

    if ann_id:
        cursor.execute("""
            UPDATE announcements
            SET title=%s,
                message=%s,
                status=%s,
                publish_at=%s,
                show_to_admins=%s,
                show_to_judges=%s,
                show_to_teams=%s,
                show_to_public=%s
            WHERE id=%s
        """, (
            title,
            message,
            status,
            publish_at_dt,
            show_to_admins,
            show_to_judges,
            show_to_teams,
            show_to_public,
            ann_id
        ))
    else:
        cursor.execute("""
            INSERT INTO announcements
            (title, message, status, publish_at,
             show_to_admins, show_to_judges, show_to_teams, show_to_public)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            title,
            message,
            status,
            publish_at_dt,
            show_to_admins,
            show_to_judges,
            show_to_teams,
            show_to_public
        ))

    conn.commit()
    action = "Updated Announcement" if ann_id else "Created Announcement"
    log_activity(action, title)
    cursor.close()
    conn.close()

    return jsonify({"status": "success"}), 200


# ---------------- PUBLISH NOW ----------------
@announcement_bp.route("/admin/announcements/<int:aid>/publish", methods=["POST"])
def publish_announcement_now(aid):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE announcements
        SET status='published',
            published_at=UTC_TIMESTAMP()
        WHERE id=%s
          AND status!='published'
    """, (aid,))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "success"}), 200


# ---------------- DELETE ----------------
@announcement_bp.route("/admin/announcements/<int:aid>", methods=["DELETE"])
def delete_announcement(aid):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM announcements WHERE id=%s", (aid,))
    log_activity("Deleted Announcement", f"ID: {aid}")
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"status": "deleted"}), 200
