import { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const API_BASE = "http://localhost:5000"; 

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [teamLimit, setTeamLimit] = useState(0); // Dynamic limit from DB
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [viewTeam, setViewTeam] = useState(null);
  const [selected, setSelected] = useState([]);
  const [confirmIds, setConfirmIds] = useState(null);

  // --- FETCH BOTH TEAMS AND CONFIG ---
  const fetchTeams = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      
      const [teamsRes, configRes] = await Promise.all([
        fetch(`${API_BASE}/admin/teams/all`, { credentials: "include" }),
        fetch(`${API_BASE}/hackathon/config`, { credentials: "include" })
      ]);

      if (teamsRes.ok && configRes.ok) {
        const teamsData = await teamsRes.json();
        const configData = await configRes.json();
        
        setTeams(teamsData);
        // Using maxTeams (matching your Flask JSON key)
        setTeamLimit(configData.maxTeams || 0); 
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    // Auto-refresh in background every 30 seconds
    const interval = setInterval(() => fetchTeams(true), 30000);
    return () => clearInterval(interval);
  }, []);

  // Stats Calculations
  const approvedCount = teams.filter(t => t.status?.toLowerCase() === "approved").length;
  const pendingCount = teams.filter(t => t.status?.toLowerCase() === "pending").length;
  const waitingCount = teams.filter(t => t.status?.toLowerCase() === "waiting").length;

  const toggleSelect = id =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // --- SMOOTH APPROVAL LOGIC ---
  const approveTeams = async (ids) => {
    try {
      setIsUpdating(true); // Subtle top-bar loader
      
      const res = await fetch(`${API_BASE}/admin/teams/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status: 'APPROVED' }),
        credentials: "include"
      });

      if (res.ok) {
        await fetchTeams(true); // Background refresh
        setSelected([]);
        setConfirmIds(null);
      } else {
        alert("Failed to update teams");
      }
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-zinc-500">Loading Dashboard...</div>;

  return (
    <div className="p-6 text-white relative">
      {/* Subtle Progress Bar */}
      {isUpdating && (
        <motion.div 
          initial={{ scaleX: 0 }} 
          animate={{ scaleX: 1 }} 
          className="fixed top-0 left-0 right-0 h-1 bg-sky-400 origin-left z-[60]" 
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teams Management</h1>
        <button 
          onClick={() => fetchTeams()} 
          className="text-sm bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat label="Approved" value={approvedCount} color="green" />
        <Stat label="Pending" value={pendingCount} color="yellow" />
        <Stat label="Waiting" value={waitingCount} color="blue" />
        <Stat label="Limit" value={teamLimit} color="gray" />
      </div>

      {/* Table Section */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-center">
          <thead className="bg-white/10 text-zinc-300">
            <tr>
              <th className="p-4"></th>
              <th className="p-4">Team Name</th>
              <th className="p-4">Leader Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <motion.tr key={team.id} whileHover={{ scale: 1.002 }} className="border-t border-white/10 hover:bg-white/5 transition">
                <td className="p-4">
                  {team.status?.toLowerCase() === "pending" && (
                    <input 
                      type="checkbox" 
                      checked={selected.includes(team.id)} 
                      onChange={() => toggleSelect(team.id)} 
                      className="w-4 h-4 accent-sky-400" 
                    />
                  )}
                </td>
                <td className="p-4 font-medium">{team.team_name}</td>
                <td className="p-4 text-zinc-400 font-mono">{team.leader_email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      team.status?.toLowerCase() === "approved" ? "bg-emerald-400/20 text-emerald-300" : 
                      team.status?.toLowerCase() === "waiting" ? "bg-sky-400/20 text-sky-300" : 
                      "bg-yellow-400/20 text-yellow-300"
                    }`}>
                    {team.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    {team.status?.toLowerCase() === "pending" && (
                      <button onClick={() => setConfirmIds([team.id])} className="px-3 py-1 text-xs bg-sky-400 text-black font-bold rounded hover:bg-sky-300 transition">
                        Approve
                      </button>
                    )}
                    <button onClick={() => setViewTeam(team)} className="px-3 py-1 text-xs bg-white/10 border border-white/20 rounded hover:bg-white/20 inline-flex items-center gap-1">
                      <FiEye size={14} /> View
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW TEAM MODAL */}
      <AnimatePresence>
        {viewTeam && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl p-8 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h2 className="text-2xl font-bold text-white">{viewTeam.team_name}</h2>
                   <p className="text-xs text-zinc-500 font-mono mt-1">UUID: {viewTeam.teamid}</p>
                </div>
                <button onClick={() => setViewTeam(null)} className="text-zinc-500 hover:text-white transition text-2xl">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <Info label="Leader Name" value={viewTeam.leader_name || "N/A"} />
                <Info label="Leader Email" value={viewTeam.leader_email} />
                <Info label="College" value={viewTeam.college || "N/A"} />
                <Info label="Education" value={viewTeam.education || "N/A"} />
                <Info label="Year" value={viewTeam.year || "N/A"} />
                <Info label="Transaction ID" value={viewTeam.transaction_id || "N/A"} />
              </div>

              <h3 className="font-semibold mb-3 text-xs uppercase tracking-widest text-zinc-500">Registered Members ({viewTeam.actual_member_count || 0})</h3>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-sm text-zinc-300 mb-6 leading-relaxed">
                {viewTeam.all_member_names || "No members found."}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmIds && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm text-center">
              <div className="w-16 h-16 bg-sky-400/20 text-sky-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">!</div>
              <h2 className="text-xl font-bold mb-2">Approve {confirmIds.length} Team(s)?</h2>
              <p className="text-sm text-zinc-400 mb-8">Teams will be moved to Approved status. If the limit ({teamLimit}) is reached, others stay pending.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmIds(null)} className="flex-1 py-3 text-zinc-400 font-semibold hover:text-white transition">Cancel</button>
                <button onClick={() => approveTeams(confirmIds)} className="flex-1 py-3 bg-sky-400 text-black font-bold rounded-xl hover:bg-sky-300 transition">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BULK SELECTION BAR */}
      {selected.length > 0 && (
        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-sky-400 text-black rounded-full px-6 py-3 flex items-center gap-6 z-40 shadow-2xl shadow-sky-400/20 font-bold">
          <span className="text-sm">{selected.length} Teams Selected</span>
          <div className="flex gap-4">
            <button onClick={() => setConfirmIds(selected)} className="bg-black text-white px-4 py-1.5 rounded-full text-xs hover:bg-zinc-800 transition">Approve All</button>
            <button onClick={() => setSelected([])} className="text-xs underline">Clear</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Helper Components
function Stat({ label, value, color }) {
  const colors = {
    green: "bg-emerald-400/10 border-emerald-400/20 text-emerald-300",
    blue: "bg-sky-400/10 border-sky-400/20 text-sky-300",
    yellow: "bg-yellow-400/10 border-yellow-400/20 text-yellow-300",
    gray: "bg-white/5 border-white/10 text-zinc-300",
  };
  return (
    <div className={`rounded-2xl p-5 border ${colors[color]} transition-all hover:bg-opacity-20`}>
      <p className="text-[10px] opacity-60 uppercase tracking-widest mb-1 font-bold">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-semibold">{label}</p>
      <p className="text-sm text-zinc-200 truncate">{value}</p>
    </div>
  );
}