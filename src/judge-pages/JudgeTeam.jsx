import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function JudgeTeam() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Using axios withCredentials to support the Flask Session
    axios.get("http://localhost:5000/judge/teams", { withCredentials: true })
      .then((res) => {
        setTeams(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        if (err.response?.status === 401) navigate("/judge/login");
        setTeams([]);
        setLoading(false);
      });
  }, [navigate]);

  /* ---------- STATS ---------- */
  const totalTeams = teams.length;
  const evaluated = teams.filter(t => t.status === "EVALUATED").length;
  const pending = totalTeams - evaluated;

  const getStatusStyle = (status) => {
    return status === "EVALUATED" 
      ? "bg-green-100 text-green-700" 
      : "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Teams</h1>
        <p className="text-gray-500 mt-1">
          You are reviewing <span className="font-semibold">{totalTeams} teams</span>.
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Assigned Teams" value={totalTeams} icon={<FiUsers />} />
        <StatCard title="Evaluated" value={evaluated} icon={<FiCheckCircle />} />
        <StatCard title="Pending" value={pending} icon={<FiClock />} />
      </div>

      {/* Teams Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Assigned Teams</h2>
        </div>

        {loading ? (
          <p className="p-10 text-center text-sm text-gray-500">Loading teams...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-left">Track</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {teams.map((team) => (
                <tr key={team.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{team.team_name}</td>
                  <td className="px-4 py-3 text-gray-600">{team.track || "General"}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(team.status)}`}>
                      {team.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="text-indigo-600 font-semibold hover:underline disabled:text-gray-400"
                      onClick={() => navigate("/judge/score", { state: { teamId: team.id } })}
                    >
                      {team.status === "EVALUATED" ? "View Results" : "Evaluate →"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white border rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className="text-indigo-600 text-2xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}