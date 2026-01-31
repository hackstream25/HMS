import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, ClipboardList, Star } from "lucide-react";

const API_BASE = "http://localhost:5000";

export default function JudgeDashboard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [judgeName, setJudgeName] = useState("");

  useEffect(() => {
    fetchMyTeams();
    // Retrieve name from localStorage or session if you stored it during login
    setJudgeName(localStorage.getItem("judgeName") || "Judge");
  }, []);

  const fetchMyTeams = async () => {
    try {
      const res = await fetch(`${API_BASE}/judge/my-teams`, { 
        credentials: "include" 
      });
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch (err) {
      console.error("Error fetching assigned teams:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Add logout logic here (clear session/localStorage)
    window.location.href = "/judge/login";
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Judge Dashboard</h1>
          <p className="text-zinc-400">Welcome back, {judgeName}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white/5 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
          <p className="text-zinc-500 text-sm mb-1">Assigned Teams</p>
          <p className="text-3xl font-bold">{teams.length}</p>
        </div>
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
          <p className="text-zinc-500 text-sm mb-1">Pending Reviews</p>
          <p className="text-3xl font-bold text-yellow-500">
            {teams.filter(t => t.status !== 'reviewed').length}
          </p>
        </div>
      </div>

      {/* Teams List */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <ClipboardList className="text-sky-400" /> Your Assignments
      </h2>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-zinc-500">Loading your teams...</p>
        ) : teams.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-dashed border-white/10">
            <p className="text-zinc-500">No teams have been assigned to you yet.</p>
          </div>
        ) : (
          teams.map((team) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900 border border-white/10 p-5 rounded-xl flex justify-between items-center hover:border-white/20 transition-all"
            >
              <div>
                <h3 className="text-lg font-bold">{team.name}</h3>
                <p className="text-sm text-zinc-500 uppercase tracking-wider">{team.category}</p>
              </div>
              
              <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 px-6 py-2 rounded-lg font-semibold transition-all">
                <Star size={18} /> Score Team
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}