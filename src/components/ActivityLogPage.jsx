import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔐 This should ideally come from your AuthContext/Global State
  const currentUser = {
    role: "SUPER_ADMIN", 
  };

  useEffect(() => {
    if (currentUser.role === "SUPER_ADMIN") {
      const interval = setInterval(fetchLogs, 30000);
      fetchLogs();
    }
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/activity-logs");
      setLogs(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  if (currentUser.role !== "SUPER_ADMIN") {
    return <div className="p-6 text-white text-xl">Access Denied</div>;
  }

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <button 
          onClick={fetchLogs}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition"
        >
          {loading ? "Refreshing..." : "Refresh Logs"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl mb-6 text-red-200">
          {error}
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-black/40 text-zinc-400">
            <tr>
              <th className="p-4">User</th>
              
              <th className="p-4">Action</th>
              <th className="p-4">Target</th>
              <th className="p-4">Time (IST)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-10 text-center text-zinc-500">Loading activity...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-zinc-500">No recent activity.</td></tr>
            ) : (
              logs.map((log) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-white/10 hover:bg-white/[0.02]"
                >
                  <td className="p-4 font-medium">{log.actor}</td>
                  
                  <td className="p-4">{log.action}</td>
                  <td className="p-4 text-zinc-400">{log.target}</td>
                  <td className="p-4 text-zinc-500 font-mono text-xs">
                    {new Date(log.time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

