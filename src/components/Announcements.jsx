import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:5000";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);
  const [confirmPublish, setConfirmPublish] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewAnnouncement, setViewAnnouncement] = useState(null);
  const [viewMode, setViewMode] = useState(false);  
  const [loading, setLoading] = useState(true);
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/announcements`);

      // If the backend sends a 500 error, we catch it here
      if (!res.ok) {
        const errText = await res.text();
        console.error("Server Error:", errText);
        return;
      }

      const raw = await res.json();

      const normalized = raw.map((a) => {
  return {
    ...a,
    // Construct the visibility object from the 4 new boolean columns
    visibility: {
      admins: Boolean(a.show_to_admins),
      judges: Boolean(a.show_to_judges),
      teams: Boolean(a.show_to_teams),
      public: Boolean(a.show_to_public),
    },
    publishAt: a.publish_at,
    publishedAt: a.published_at,
  };
});

      setAnnouncements(normalized);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 30000);
    return () => clearInterval(interval);
  }, []);

  const saveAnnouncement = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/admin/announcements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchAnnouncements();
        setEditorOpen(false);
        setActiveAnnouncement(null);
      }
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const publishNow = async (ann) => {
    try {
      const res = await fetch(
        `${API_BASE}/admin/announcements/${ann.id}/publish`,
        { method: "POST" },
      );
      if (res.ok) {
        fetchAnnouncements();
        setConfirmPublish(null);
      }
    } catch (err) {
      console.error("Publish failed", err);
    }
  };

  const deleteAnnouncement = async (ann) => {
  try {
    const res = await fetch(
      `${API_BASE}/admin/announcements/${ann.id}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      fetchAnnouncements();
      setConfirmDelete(null);
      setViewAnnouncement(null);
    }
  } catch (err) {
    console.error("Delete failed", err);
  }
};


  if (loading)
    return (
      <p className="p-6 text-white text-center">Loading announcements...</p>
    );

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Announcements</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat label="Total" value={announcements.length} />
        <Stat
          label="Drafts"
          value={announcements.filter((a) => a.status === "draft").length}
        />
        <Stat
          label="Scheduled"
          value={announcements.filter((a) => a.status === "scheduled").length}
        />
        <Stat
          label="Published"
          value={announcements.filter((a) => a.status === "published").length}
        />
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setActiveAnnouncement(null);
            setViewMode(false);
            setEditorOpen(true);
          }}
          className="bg-sky-400/20 border border-sky-400/40 px-5 py-2 rounded-lg text-sm"
        >
          + New Announcement
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4">Audience</th>
              <th className="p-4">Status</th>
              <th className="p-4">Timeline</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr
                key={a.id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="p-4 font-medium">{a.title}</td>
                <td className="p-4 text-center text-zinc-400">
                  {Object.entries(a.visibility || {})
                    .filter(([_, val]) => val)
                    .map(([key]) => key)
                    .join(", ") || "None"}
                </td>
                <td className="p-4 text-center">
                  <StatusBadge status={a.status} />
                </td>
                <td className="p-4 text-center text-zinc-400">
                  {a.status === "published"
                    ? `Published: ${new Date(a.publishedAt).toLocaleString(
                        "en-IN",
                        {
                          timeZone: "Asia/Kolkata",
                          dateStyle: "medium",
                          timeStyle: "short",
                        },
                      )}
`
                    : a.status === "scheduled"
                      ? `Scheduled: ${new Date(a.publishAt).toLocaleString(
                          "en-IN",
                          {
                            timeZone: "Asia/Kolkata",
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )}
`
                      : "—"}
                </td>
                <td className="p-4 text-center flex justify-center gap-4">

  {/* VIEW – always available */}
  <button
  onClick={() => setViewAnnouncement(a)}
  className="text-indigo-300 underline"
>
  View
</button>


  {/* EDIT – only if not published */}
  {a.status !== "published" && (
    <button
      onClick={() => {
        setActiveAnnouncement(a);
        setViewMode(false);
        setEditorOpen(true);
      }}
      className="text-sky-300 underline"
    >
      Edit
    </button>
  )}

  {/* PUBLISH – only if not published */}
  {a.status !== "published" && (
    <button
      onClick={() => setConfirmPublish(a)}
      className="text-emerald-400 underline"
    >
      Publish Now
    </button>

    
  )}
  {/* REMOVE – always available */}
<button
  onClick={() => setConfirmDelete(a)}
  className="text-red-400 underline"
>
  Remove
</button>

</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnnouncementEditor
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setViewMode(false);
        }}
        initialData={activeAnnouncement}
        onSave={saveAnnouncement}
        viewMode={viewMode}   
      />

      <AnimatePresence>
        {confirmPublish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md">
              <h2 className="text-lg font-semibold mb-2">
                Publish Announcement
              </h2>
              <p className="text-sm text-zinc-400 mb-6">
                Visible to selected audiences immediately.
              </p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setConfirmPublish(null)}>Cancel</button>
                <button
                  onClick={() => publishNow(confirmPublish)}
                  className="bg-emerald-400/20 border border-emerald-400/40 px-5 py-2 rounded-lg"
                >
                  Publish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
  {confirmDelete && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    >
      <motion.div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-3 text-red-400">
          Remove Announcement
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          This action is permanent and cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <button onClick={() => setConfirmDelete(null)}>Cancel</button>
          <button
            onClick={() => deleteAnnouncement(confirmDelete)}
            className="bg-red-500/20 border border-red-500/40 px-5 py-2 rounded-lg text-red-400"
          >
            Remove
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

            {/* VIEW POPUP */}
      <AnimatePresence>
        {viewAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 rounded-2xl w-full max-w-2xl p-8"
            >
              <h2 className="text-xl font-semibold mb-4">
                {viewAnnouncement.title}
              </h2>

              <p className="text-zinc-300 whitespace-pre-wrap mb-6">
                {viewAnnouncement.message}
              </p>

              <div className="text-sm text-zinc-400 mb-4">
                <strong>Audience:</strong>{" "}
                {Object.entries(viewAnnouncement.visibility || {})
                  .filter(([_, v]) => v)
                  .map(([k]) => k)
                  .join(", ") || "None"}
              </div>

              <div className="text-sm text-zinc-400 mb-6">
                {viewAnnouncement.status === "published" && (
                  <>
                    Published at:{" "}
                    {new Date(viewAnnouncement.publishedAt).toLocaleString(
                      "en-IN",
                      { timeZone: "Asia/Kolkata" }
                    )}
                  </>
                )}
                {viewAnnouncement.status === "scheduled" && (
                  <>
                    Scheduled for:{" "}
                    {new Date(viewAnnouncement.publishAt).toLocaleString(
                      "en-IN",
                      { timeZone: "Asia/Kolkata" }
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-end gap-4">
  <button
    onClick={() => setConfirmDelete(viewAnnouncement)}
    className="px-5 py-2 rounded-lg bg-red-500/20 text-red-400"
  >
    Remove
  </button>

  <button
    onClick={() => setViewAnnouncement(null)}
    className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20"
  >
    Close
  </button>
</div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function AnnouncementEditor({ open, onClose, initialData, onSave, viewMode }) {
  // 1. FIX: Corrected state initialization
  const [data, setData] = useState({
    title: "",
    message: "",
    status: "draft",
    publishAt: "",
    visibility: {
      admins: true,
      judges: false,
      teams: false,
      public: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        let formattedDate = "";
        const rawDate = initialData.publishAt; // Using normalized name from fetchAnnouncements

        if (rawDate) {
          const date = new Date(rawDate);
          formattedDate = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000,
          )
            .toISOString()
            .slice(0, 16);
        }

        setData({
          ...initialData,
          publishAt: formattedDate,
          // 2. FIX: No more JSON.parse needed. fetchAnnouncements already did the work.
          visibility: initialData.visibility || {
            admins: true,
            judges: false,
            teams: false,
            public: false,
          },
        });
      } else {
        // Reset for New Announcement
        setData({
          title: "",
          message: "",
          status: "draft",
          publishAt: "",
          visibility: {
            admins: true,
            judges: false,
            teams: false,
            public: false,
          },
        });
      }
    }
  }, [initialData, open]);

  if (!open) return null;

  return (
    <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <motion.div className="bg-gray-800 p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">
          {viewMode
            ? "View Announcement"
            : initialData
            ? "Edit Announcement"
            : "New Announcement"}
        </h2>
        <div className="mb-4">
          <label className="text-sm text-zinc-400">Title</label>
          <input
            disabled={viewMode}
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full mt-1 p-3 bg-black/40 rounded-lg border border-white/10"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-zinc-400">Message</label>
          <textarea
            disabled={viewMode}
            rows={4}
            value={data.message}
            onChange={(e) => setData({ ...data, message: e.target.value })}
            className="w-full mt-1 p-3 bg-black/40 rounded-lg border border-white/10"
          />
        </div>
        <div className="mb-6">
          <p className="text-sm text-zinc-400 mb-3">Visible To</p>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data.visibility).map(([key, value]) => (
              <button
                key={key}
                type="button"
                disabled={viewMode}
                onClick={() =>
                  setData({
                    ...data,
                    visibility: { ...data.visibility, [key]: !value },
                  })
                }
                className={`flex items-center justify-between px-4 py-2 rounded-xl border transition-all ${
                  value
                    ? "bg-sky-400/15 border-sky-400/40 text-sky-300"
                    : "bg-black/30 border-white/10 text-zinc-400"
                }`}
              >
                <span className="capitalize">{key}</span>
                <span className="text-[10px]">{value ? "ON" : "OFF"}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-zinc-400">Status</label>
            <select
              disabled={viewMode}
              value={data.status}
              onChange={(e) => setData({ ...data, status: e.target.value })}
              className="w-full mt-1 p-3 bg-black/40 rounded-lg border border-white/10"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>
          {data.status === "scheduled" && (
            <div>
              <label className="text-sm text-zinc-400">Publish At (IST)</label>
              <input
                disabled={viewMode}
                type="datetime-local"
                value={data.publishAt || ""}
                onChange={(e) =>
                  setData({ ...data, publishAt: e.target.value })
                }
                className="w-full mt-1 p-3 bg-black/40 rounded-lg border border-white/10 text-white"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-4">
          {viewMode ? (
            <button onClick={onClose} className="px-6 py-2 bg-white/10 rounded-lg">Close</button>
          ) : (
            <>
              <button onClick={onClose}>Cancel</button>
              <button
                onClick={() => onSave(data)}
                className="bg-sky-400/20 border border-sky-400/40 px-6 py-2 rounded-lg text-sky-300"
              >
                Save
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    draft: "bg-yellow-400/20 text-yellow-300",
    scheduled: "bg-blue-400/20 text-blue-300",
    published: "bg-emerald-400/20 text-emerald-300",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs ${map[status]}`}>
      {status}
    </span>
  );
}
