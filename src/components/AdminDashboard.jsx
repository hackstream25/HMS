import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CircularStat from "../react-bits/CircularStat";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiCheckCircle, FiShield, FiClock, FiFileText } from "react-icons/fi";

const API_BASE = "http://localhost:5000";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    teamLimit: 0,
    approvedTeams: 0,
    pendingTeams: 0,
    judgesActive: 0,
    submittedCount: 0,
    evaluatedCount: 0,
    phase: "Loading...",
  });
const navigate = useNavigate();
  // Fetch dynamic data from Flask
  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard-stats`);
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Dashboard Stats Error:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh stats every 60 seconds
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate Progress Percentage for the bar
  const registrationProgress = stats.teamLimit > 0 
    ? Math.min((stats.approvedTeams / stats.teamLimit) * 100, 100) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-wide">
          Hackathon Control Center
        </h1>
        <p className="text-zinc-300 mt-1 font-medium">
          High-level system overview
        </p>
      </motion.div>

      {/* Current Phase & Progress Bar */}
      <motion.div
        className="mt-8 p-6 rounded-2xl bg-slate-800/80 backdrop-blur border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-sm text-zinc-300 font-medium">Current Phase</p>
        <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
          <FiClock /> {stats.phase}
        </h2>

        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${registrationProgress}%` }}
          />
        </div>

        <p className="text-zinc-300 mt-2 text-sm font-medium">
          {stats.approvedTeams} / {stats.teamLimit} teams approved
        </p>
      </motion.div>

      {/* Circular Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <CircularStat
          title={<span className="flex items-center gap-2"><FiUsers /> Team Capacity</span>}
          value={stats.approvedTeams}
          total={stats.teamLimit || 1}
          color="#34d399"
          subtitle="Approved Teams"
        />

        <CircularStat
          title={<span className="flex items-center gap-2"><FiCheckCircle /> Judges</span>}
          value={stats.judgesActive}
          total={10} // Target goal
          color="#60a5fa"
          subtitle="Active Judges"
        />

        <CircularStat
          title={<span className="flex items-center gap-2"><FiFileText /> Submissions</span>}
          value={stats.submittedCount}
          total={stats.approvedTeams || 1}
          color="#a78bfa"
          subtitle="Projects Received"
        />
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 rounded-2xl bg-slate-800/80 backdrop-blur border border-white/10 hover:bg-slate-700/50 transition">
          <p className="text-sm text-zinc-300 font-medium flex items-center gap-2">
            <FiUsers /> Pending Approvals
          </p>
          <h2 className="text-3xl font-bold mt-2 text-amber-300">
            {stats.pendingTeams}
          </h2>
          <p className="text-zinc-300 mt-1 text-sm font-medium">
            Teams awaiting verification
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/80 backdrop-blur border border-white/10 hover:bg-slate-700/50 transition">
          <p className="text-sm text-zinc-300 font-medium flex items-center gap-2">
            <FiCheckCircle /> Evaluation Progress
          </p>
          <h2 className="text-3xl font-bold mt-2 text-sky-300">
            {stats.evaluatedCount} <span className="text-lg text-zinc-500">/ {stats.approvedTeams}</span>
          </h2>
          <p className="text-zinc-300 mt-1 text-sm font-medium">
            Teams scored by judges
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/80 backdrop-blur border border-white/10 hover:bg-slate-700/50 transition">
          <p className="text-sm text-zinc-300 font-medium flex items-center gap-2">
            <FiShield /> System Status
          </p>
          <h2 className="text-3xl font-bold mt-2 text-emerald-300">
            Operational
          </h2>
          <p className="text-zinc-300 mt-1 text-sm font-medium">
            Database and API are live
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <button 
          onClick={() => navigate("/admin/teams")} 
          className="bg-emerald-600/90 rounded-xl py-4 font-semibold hover:bg-emerald-600 transition border border-white/10 shadow-md flex items-center justify-center gap-2"
        >
          <FiCheckCircle /> Manage Team Approvals
        </button>

        <button 
          onClick={() => navigate("/admin/problem")} 
          className="bg-slate-700 rounded-xl py-4 font-semibold hover:bg-slate-600 transition border border-white/10 shadow-md flex items-center justify-center gap-2"
        >
          <FiFileText /> Problem Statements
        </button>

        <button 
          onClick={() => navigate("/admin/judges")} 
          className="bg-indigo-600/90 rounded-xl py-4 font-semibold hover:bg-indigo-600 transition border border-white/10 shadow-md flex items-center justify-center gap-2"
        >
          <FiUsers /> Add Judges
        </button>
      </div>
    </div>
  );
}