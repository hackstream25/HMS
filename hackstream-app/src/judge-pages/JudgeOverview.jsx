import { motion } from "framer-motion";
import { FiUsers, FiCheckCircle, FiClock, FiAward, FiArrowRight } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JudgeAnnouncement from "./JudgeAnnouncement";
import JudgeEvent from "./JudgeEvent";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000", withCredentials: true });

export default function JudgeOverview() {
  const navigate = useNavigate();
  const [view, setView] = useState("phase");
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    evaluated: 0,
    pending: 0
  });

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const res = await api.get("/judge/teams");
        const teamData = Array.isArray(res.data) ? res.data : [];
        setTeams(teamData);

        const evaluatedCount = teamData.filter(t => t.status === "EVALUATED").length;
        setStats({
          total: teamData.length,
          evaluated: evaluatedCount,
          pending: teamData.length - evaluatedCount
        });
      } catch (err) {
        console.error("Failed to load overview data", err);
      }
    };
    loadOverview();
  }, []);

  // Filter teams that need grading
  const pendingTeams = teams.filter(t => t.status !== "EVALUATED").slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[#1E293B]">Judge Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Welcome back! Here is your scoring progress.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Assigned Teams" value={stats.total} icon={<FiUsers />} color="blue" />
        <StatCard label="Pending Reviews" value={stats.pending} icon={<FiClock />} color="yellow" />
        <StatCard label="Completed" value={stats.evaluated} icon={<FiCheckCircle />} color="green" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Priority Review List (Dynamic Phase View) */}
        <motion.div className="lg:col-span-2 bg-[#E6E9EF] border border-slate-300 rounded-2xl p-6">
          {view === "phase" && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-[#1E293B]">Priority Review Queue</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">ACTION REQUIRED</span>
              </div>

              <div className="space-y-3">
                {pendingTeams.length > 0 ? (
                  pendingTeams.map(team => (
                    <div key={team.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div>
                        <p className="font-bold text-slate-800">{team.team_name}</p>
                        <p className="text-xs text-slate-500">{team.track}</p>
                      </div>
                      <button 
                        onClick={() => navigate("/judge/score", { state: { teamId: team.id } })}
                        className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition"
                      >
                        Grade Now <FiArrowRight />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <FiAward className="mx-auto text-4xl text-green-500 mb-2" />
                    <p className="text-slate-600 font-medium">All caught up! Excellent work.</p>
                  </div>
                )}
              </div>
              
              {stats.pending > 3 && (
                <button 
                  onClick={() => navigate("/judge/team")}
                  className="w-full mt-4 text-center text-sm text-slate-500 hover:text-blue-600 font-medium"
                >
                  View all {stats.pending} pending teams
                </button>
              )}
            </>
          )}

          {/* ... keeping your existing Announcement/Timeline views ... */}
          {view === "announcements" && <JudgeAnnouncement onBack={() => setView("phase")} />}
          {view === "timeline" && <JudgeEvent onBack={() => setView("phase")} />}
        </motion.div>

        {/* Quick Actions */}
        <div className="space-y-4">
            <h3 className="font-semibold text-[#1E293B]">Navigation</h3>
            <QuickActionButton active={view === "phase"} label="Review Queue" onClick={() => setView("phase")} />
            <QuickActionButton active={view === "announcements"} label="Announcements" onClick={() => setView("announcements")} />
            <QuickActionButton active={view === "timeline"} label="Event Schedule" onClick={() => setView("timeline")} />
        </div>
      </div>
    </div>
  );
}

// Sub-components for cleaner code
function StatCard({ label, value, icon, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-100",
    yellow: "text-yellow-600 bg-yellow-100",
    green: "text-green-600 bg-green-100"
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function QuickActionButton({ active, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${
                active ? "bg-[#1E3A8A] text-white shadow-lg" : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
        >
            {label}
        </button>
    );
}