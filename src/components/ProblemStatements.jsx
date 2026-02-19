import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:5000";

// Helper to calculate labels in the table
function timeDiffLabel(from, to) {
  const diffMs = Math.abs(to - from);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""}`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs > 1 ? "s" : ""}`;
}

export default function ProblemStatements() {
  const [problems, setProblems] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [activePS, setActivePS] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmPublish, setConfirmPublish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewPS, setViewPS] = useState(null);

  const fetchProblems = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/problem-statements`);
      const data = await res.json();
      setProblems(data);
    } catch (err) {
      console.error("Failed to fetch problems", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
    const interval = setInterval(fetchProblems, 30000);
    return () => clearInterval(interval);
  }, []);

  const saveProblem = async (ps) => {
    try {
      await fetch(`${API_BASE}/admin/problem-statements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ps.id ?? null,
          title: ps.title,
          track: ps.track,
          description: ps.description,
          status: ps.status,
          publishAt: ps.publishAt, 
        }),
      });
      fetchProblems();
      setShowEditor(false);
      setActivePS(null);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const publishNow = async (ps) => {
    try {
      await fetch(`${API_BASE}/admin/problem-statements/${ps.id}/publish`, { method: "POST" });
      fetchProblems();
      setConfirmPublish(null);
    } catch (err) {
      console.error("Publish failed", err);
    }
  };

const removeProblem = async (ps) => {
  await fetch(`${API_BASE}/admin/problem-statements/${ps.id}`, {
    method: "DELETE",
  });
  fetchProblems();
};


  if (loading) return <p className="p-6 text-white">Loading problem statements...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Problem Statements</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat label="Total" value={problems.length} />
        <Stat label="Drafts" value={problems.filter(p => p.status === "draft").length} />
        <Stat label="Scheduled" value={problems.filter(p => p.status === "scheduled").length} />
        <Stat label="Published" value={problems.filter(p => p.status === "published").length} />
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => { setActivePS(null); setShowEditor(true); }}
          className="bg-sky-400/20 border border-sky-400/40 px-5 py-2 rounded-lg text-sm"
        >
          + Add Problem Statement
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4">Track</th>
              <th className="p-4">Status</th>
              <th className="p-4">Publish Timeline</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(ps => (
              <tr key={ps.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="p-4 font-medium">{ps.title}</td>
                <td className="p-4 text-center">{ps.track}</td>
                <td className="p-4 text-center"><StatusBadge status={ps.status} /></td>
                <td className="p-4 text-center text-zinc-400">
                    {ps.status === "published" && ps.published_at && (
                        <>
                        Published: {new Date(ps.published_at).toLocaleString()}
                        <div className="text-xs text-zinc-500">
                            (after {ps.publish_at ? timeDiffLabel(new Date(ps.publish_at), new Date(ps.published_at)) : "manual"})
                        </div>
                        </>
                    )}
                    {ps.status === "scheduled" && ps.publish_at && (
                        <>
                        Scheduled: {new Date(ps.publish_at).toLocaleString()}
                        <div className="text-xs text-zinc-500">
                            (publishing in {timeDiffLabel(new Date(), new Date(ps.publish_at))})
                        </div>
                        </>
                    )}
                    {ps.status === "draft" && "—"}
                </td>
                <td className="p-4 text-center flex justify-center gap-4">
                  <button onClick={() => { setActivePS(ps); setShowEditor(true); }} className="text-sky-300 underline">Edit</button>
                  <button onClick={() => setViewPS(ps)} className="text-zinc-300 underline">View</button>
                  {ps.status !== "published" && (
                    <button onClick={() => setConfirmPublish(ps)} className="text-emerald-400 underline">Publish Now</button>
                  )}
                  <button
  onClick={() => setConfirmDelete(ps)}
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

      <EditorModal open={showEditor} onClose={() => setShowEditor(false)} initialData={activePS} onSave={saveProblem} />

      <AnimatePresence>
        {confirmPublish && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md">
              <h2 className="text-lg font-semibold mb-2">Publish Problem Statement</h2>
              <p className="text-sm text-zinc-400 mb-6">This will immediately make <strong className="text-white">{confirmPublish.title}</strong> visible.</p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setConfirmPublish(null)}>Cancel</button>
                <button onClick={() => publishNow(confirmPublish)} className="bg-emerald-400/20 border border-emerald-400/40 px-5 py-2 rounded-lg">Publish</button>
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
          Remove Problem Statement
        </h2>

        <p className="text-sm text-zinc-400 mb-6">
          This action is permanent and cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <button onClick={() => setConfirmDelete(null)}>
            Cancel
          </button>

          <button
            onClick={() => {
              removeProblem(confirmDelete);
              setConfirmDelete(null);
            }}
            className="bg-red-500/20 border border-red-500/40 px-5 py-2 rounded-lg text-red-400"
          >
            Remove
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      <ViewProblemModal ps={viewPS} onClose={() => setViewPS(null)} />
    </div>
  );
}

/* --- EditorModal with FIXED TIME HANDLING --- */
function EditorModal({ open, onClose, initialData, onSave }) {
  const [data, setData] = useState({ id: null, title: "", track: "", description: "", status: "draft", publishAt: null });

  useEffect(() => {
    if (initialData) {
      // FIX: Convert the UTC date from DB to Local time for the input field
      let localTime = "";
      if (initialData.publish_at) {
        const date = new Date(initialData.publish_at);
        // This creates 'YYYY-MM-DDTHH:MM' in local time
        const offset = date.getTimezoneOffset() * 60000;
        localTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
      }

      setData({
        id: initialData.id,
        title: initialData.title,
        track: initialData.track,
        description: initialData.description,
        status: initialData.status,
        publishAt: localTime,
      });
    } else {
      setData({ id: null, title: "", track: "", description: "", status: "draft", publishAt: null });
    }
  }, [initialData, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div className="bg-gray-800 p-8 rounded-2xl w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-6">{initialData ? "Edit Problem Statement" : "New Problem Statement"}</h2>
            <Input label="Title" value={data.title} onChange={v => setData({ ...data, title: v })} />
            <Input label="Track" value={data.track} onChange={v => setData({ ...data, track: v })} />
            <TextArea label="Description" value={data.description} onChange={v => setData({ ...data, description: v })} />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm text-zinc-400">Status</label>
                <select value={data.status} onChange={e => setData({ ...data, status: e.target.value })} className="w-full mt-1 p-3 bg-black/40 rounded-lg border border-white/10">
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>
              {data.status === "scheduled" && (
                <div>
                  <label className="text-sm text-zinc-400">Publish At (IST)</label>
                  <input 
                    type="datetime-local" 
                    className="w-full mt-1 p-3 bg-black/40 rounded-lg border border-white/10 text-white" 
                    value={data.publishAt || ""} 
                    onChange={e => setData({ ...data, publishAt: e.target.value })} 
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-4">
              <button onClick={onClose}>Cancel</button>
              <button onClick={() => onSave(data)} className="bg-sky-400/20 border border-sky-400/40 px-6 py-2 rounded-lg">Save</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Rest of the UI helper components (Stat, StatusBadge, Input, TextArea, ViewProblemModal) 
// stay exactly as they were in your original code...

// Internal Sub-components for UI
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
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}>{status}</span>;
}

function Input({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="text-sm text-zinc-400">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full mt-1 p-3 bg-black/40 rounded-lg border border-white/10 text-white focus:outline-none focus:border-sky-400/50" />
    </div>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="text-sm text-zinc-400">{label}</label>
      <textarea rows={5} value={value} onChange={e => onChange(e.target.value)} className="w-full mt-1 p-3 bg-black/40 rounded-lg border border-white/10 text-white focus:outline-none focus:border-sky-400/50" />
    </div>
  );
}

function ViewProblemModal({ ps, onClose }) {
  if (!ps) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-gray-800 p-8 rounded-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
          <h2 className="text-xl font-semibold mb-4">{ps.title}</h2>
          <div className="flex gap-3 mb-4"><span className="px-3 py-1 rounded-full bg-white/10 text-xs">{ps.track}</span><StatusBadge status={ps.status} /></div>
          <p className="text-zinc-300 whitespace-pre-line mb-6 leading-relaxed">{ps.description}</p>
          <div className="text-sm text-zinc-500 mb-6">
            {ps.status === "published" ? `Published: ${new Date(ps.published_at).toLocaleString()}` : ps.status === "scheduled" ? `Scheduled: ${new Date(ps.publish_at).toLocaleString()}` : "Status: Draft"}
          </div>
          <div className="flex justify-end"><button onClick={onClose} className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Close</button></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}