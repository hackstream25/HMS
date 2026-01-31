import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:5000"; // Adjust to your flask port

export default function Judges() {
  const [judges, setJudges] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- STATE ---------------- */
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [category, setCategory] = useState("All");
  const [showAddJudge, setShowAddJudge] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeReviews, setActiveReviews] = useState([]);
  const [newJudge, setNewJudge] = useState({ name: "", email: "" });
  const [confirmRemoveJudge, setConfirmRemoveJudge] = useState(null);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jRes, tRes] = await Promise.all([
        fetch(`${API_BASE}/admin/judges`, { credentials: "include" }),
        fetch(`${API_BASE}/admin/teams`, { credentials: "include" })
      ]);

      if (!jRes.ok || !tRes.ok) {
        throw new Error(`Judges: ${jRes.status}, Teams: ${tRes.status}`);
      }

      const jData = await jRes.json();
      const tData = await tRes.json();
      
      setJudges(Array.isArray(jData) ? jData : []);
      setTeams(Array.isArray(tData) ? tData : []);
    } catch (err) {
      console.error("Fetch error details:", err);
      setJudges([]);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */
  // Updated to match potential review object structure
  const totalScore = r => r ? (r.innovation || 0) + (r.technical || 0) + (r.impact || 0) + (r.presentation || 0) : 0;

  const judgeStats = judgeId => {
    const assigned = teams.filter(t => t.assignedJudge === judgeId);
    // Updated: Backend uses 1/0 for is_evaluated
    const reviewed = assigned.filter(t => t.reviewed === 1 || t.reviewed === true);
    return {
      assigned: assigned.length,
      reviewed: reviewed.length,
      avg: reviewed.length > 0
          ? Math.round(reviewed.reduce((a, b) => a + (b.score || 0), 0) / reviewed.length)
          : "-",
    };
  };

  const statusOf = team => {
    // Matches your backend logic: is_evaluated or status column
    if (team.reviewed === 1 || team.reviewed === true) return "reviewed";
    if (team.assignedJudge) return "assigned";
    return "unassigned";
  };

  /* ---------------- ACTIONS ---------------- */

  const openReviews = async (judgeId) => {
  // 1. Reset state to prevent seeing the previous judge's data
  setActiveReviews([]);
  setShowReviewModal(true);

  try {
    const res = await fetch(`${API_BASE}/admin/global-reviews`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch reviews");

    const allReviews = await res.json();

    // 2. Filter using the judgeId we just added to the backend
    // Make sure to compare same types (both numbers or both strings)
    const filtered = allReviews.filter(review => Number(review.judgeId) === Number(judgeId));
    
    setActiveReviews(filtered);
  } catch (err) {
    console.error("Error fetching reviews:", err);
  }
};



  const assignTeam = async (teamId) => {
    if (!selectedJudge) return;
    
    setTeams(prev => prev.map(t => 
      t.id === teamId ? { ...t, assignedJudge: selectedJudge } : t
    ));

    try {
      const res = await fetch(`${API_BASE}/admin/assign-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, judgeId: selectedJudge }),
        credentials: "include"
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to assign team");
        fetchData(); 
      }
    } catch (err) {
      console.error("Assignment error:", err);
      fetchData(); 
    }
  };

  const unassignTeam = async (teamId) => {
    setTeams(prev => prev.map(t => 
      t.id === teamId ? { ...t, assignedJudge: null } : t
    ));

    try {
      const res = await fetch(`${API_BASE}/admin/assign-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, judgeId: null }),
        credentials: "include"
      });
      if (!res.ok) fetchData(); 
    } catch (err) {
      console.error("Unassign error:", err);
      fetchData();
    }
  };

  const addJudge = async () => {
    if (!newJudge.name || !newJudge.email) return;
    try {
      const res = await fetch(`${API_BASE}/admin/judges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJudge),
        credentials: "include"
      });
      
      const data = await res.json();
      if (res.ok) {
        fetchData();
        setShowAddJudge(false);
        setNewJudge({ name: "", email: "" });
      } else {
        alert(data.error || "Failed to add judge");
      }
    } catch (err) {
      console.error("Add Judge error:", err);
      alert("Server connection failed.");
    }
  };

  const removeJudge = async (judgeOrId) => {
    const jid = typeof judgeOrId === 'object' ? judgeOrId.id : judgeOrId;
    if (!jid) return;

    try {
      const res = await fetch(`${API_BASE}/admin/judges/${jid}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        setConfirmRemoveJudge(null);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete judge");
      }
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  const filteredTeams = teams.filter(t => t.status?.toLowerCase() === "approved");


  if (loading) return <div className="p-10 text-center text-zinc-500">Loading judges...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Judges Management</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat label="Judges" value={judges.length} />
        {/* Count only approved teams as relevant for this view */}
        <Stat label="Approved Teams" value={teams.filter(t => t.status?.toLowerCase() === "approved").length} />
        <Stat label="Assigned" value={teams.filter(t => t.assignedJudge).length} />
        <Stat label="Reviewed" value={teams.filter(t => t.reviewed === 1 || t.reviewed === true).length} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* JUDGES COLUMN */}
        <div className="col-span-4 bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Judges</h2>
            <button
              onClick={() => setShowAddJudge(true)}
              className="bg-white/10 px-3 py-1 rounded text-sm"
            >
              + Add
            </button>
          </div>

          {judges.map(j => {
            const s = judgeStats(j.id);
            return (
              <div
                key={j.id}
                onClick={() => setSelectedJudge(j.id)}
                className={`p-3 mb-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedJudge === j.id
                    ? "border-sky-400/40 bg-sky-400/10"
                    : "border-white/10 hover:bg-white/5"
                }`}
              >
                <p className="font-medium">{j.name}</p>
                <p className="text-xs text-zinc-400">{j.email}</p>
                <p className="text-xs mt-1 text-zinc-400">
                  Assigned: {s.assigned} • Reviewed: {s.reviewed} • Avg: {s.avg}
                </p>

                <div className="flex justify-between mt-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      openReviews(j.id);
                    }}
                    className="text-xs underline text-sky-300"
                  >
                    View Reviews
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setConfirmRemoveJudge(j);
                    }}
                    className="text-xs text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* TEAMS COLUMN */}
        <div className="col-span-8 bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Teams</h2>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-black/40 border border-white/10 px-3 py-1 rounded"
            >
              <option>All</option>
              <option>Web</option>
              <option>AI</option>
              <option>Data</option>
            </select>
          </div>

          {!selectedJudge && (
            <p className="text-zinc-400 text-center py-10">Select a judge to manage assignments</p>
          )}

          {selectedJudge && filteredTeams.map(team => {
            const status = statusOf(team);
            return (
              <div
                key={team.id}
                className={`flex justify-between items-center py-3 border-b border-white/10 ${
                  (team.reviewed === 1 || team.reviewed === true) ? "opacity-50" : ""
                }`}
              >
                <div>
                  <p className="font-medium">{team.name}</p>
                  <p className="text-xs text-zinc-400">
                    Evaluated At: {team.evaluatedAt || "Not yet"} • {status}
                  </p>

                </div>

                <div className="flex gap-2">
                  {status === "unassigned" && (
                    <button
                      onClick={() => assignTeam(team.id)}
                      className="bg-sky-400/20 px-3 py-1 rounded text-sm hover:bg-sky-400/30"
                    >
                      Assign
                    </button>
                  )}

                  {status === "assigned" && team.assignedJudge === selectedJudge && (
                    <button
                      onClick={() => unassignTeam(team.id)}
                      className="text-red-400 text-sm hover:underline"
                    >
                      Unassign
                    </button>
                  )}

                  {status === "reviewed" && (
                    <span className="text-emerald-300 text-sm">Final</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODALS */}
      <ReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        reviews={activeReviews}
        totalScore={totalScore}
      />

      <AddJudgeModal
        open={showAddJudge}
        onClose={() => setShowAddJudge(false)}
        newJudge={newJudge}
        setNewJudge={setNewJudge}
        onAdd={addJudge}
      />

      <ConfirmRemoveModal
        judge={confirmRemoveJudge}
        onCancel={() => setConfirmRemoveJudge(null)}
        onConfirm={removeJudge}
      />
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Stat({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ReviewModal({ open, onClose, reviews }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-gray-800 p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-800 py-2 z-10 border-b border-white/10">
              <h2 className="text-xl font-bold">Judge's Reviews</h2>
              <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                <span className="text-2xl">×</span>
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-500 italic">This judge hasn't submitted any reviews yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((team) => (
                  <div key={team.teamId} className="bg-white/5 border border-white/10 rounded-lg p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-sky-300">{team.teamName}</h3>
                        <p className="text-xs text-zinc-500">
                          Completed: {team.evaluatedAt || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-white">{team.totalScore}</span>
                        <span className="text-zinc-500 text-sm ml-1">pts</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {team.rubrics?.map((rubric, idx) => (
                        <div key={idx} className="flex justify-between bg-black/30 p-2 px-3 rounded border border-white/5">
                          <span className="text-sm text-zinc-300">{rubric.name}</span>
                          <span className="text-sm font-mono text-emerald-400">
                            {rubric.score} <span className="text-zinc-600">/ {rubric.max_score}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



function AddJudgeModal({ open, onClose, newJudge, setNewJudge, onAdd }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
            className="bg-gray-800 p-6 rounded-xl w-full max-w-sm"
          >
            <h2 className="font-semibold mb-4 text-lg">Add New Judge</h2>
            <input
              placeholder="Full Name"
              className="w-full mb-3 p-2 bg-black/40 rounded border border-white/10 focus:border-sky-400 outline-none"
              value={newJudge.name}
              onChange={e => setNewJudge({ ...newJudge, name: e.target.value })}
            />
            <input
              placeholder="Email Address"
              className="w-full mb-6 p-2 bg-black/40 rounded border border-white/10 focus:border-sky-400 outline-none"
              value={newJudge.email}
              onChange={e => setNewJudge({ ...newJudge, email: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="text-zinc-400 px-3">Cancel</button>
              <button
                onClick={onAdd}
                className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded font-medium"
              >
                Add Judge
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ConfirmRemoveModal({ judge, onCancel, onConfirm }) {
  return (
    <AnimatePresence>
      {judge && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
            className="bg-gray-800 p-6 rounded-xl max-w-sm w-full"
          >
            <h2 className="font-semibold mb-2 text-lg text-red-400">Remove {judge.name}?</h2>
            <p className="text-sm text-zinc-400 mb-6">
              This action cannot be undone. Unreviewed teams will be unassigned automatically.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={onCancel} className="text-zinc-400 px-3">Cancel</button>
              <button
                onClick={() => onConfirm(judge)}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-medium"
              >
                Confirm Remove
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}