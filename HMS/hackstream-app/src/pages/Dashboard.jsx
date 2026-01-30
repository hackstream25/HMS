import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import StatCard from "../components/StatCard";
import CountdownTimer from "../components/CountdownTimer";
import { getUser } from "../utils/getUser";

export default function Dashboard() {
  const user = getUser();
  const teamId = user?.teamId;

  const [data, setData] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("Pending");

  useEffect(() => {
    if (!teamId) return;

    // DASHBOARD DATA
    axios
      .get(`http://localhost:5000/dashboard/${teamId}`, {
        withCredentials: true
      })
      .then(res => setData(res.data))
      .catch(err => console.error(err));

    // SUBMISSION STATUS
    axios
      .get(`http://localhost:5000/submission/status/${teamId}`, {
        withCredentials: true
      })
      .then(res => {
        if (res.data.submitted) {
          setSubmissionStatus("Submitted");
        }
      })
      .catch(err => console.error(err));

  }, [teamId]);

  if (!data) return null;

  return (
    <div className="space-y-12">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-8 rounded-3xl
                   bg-white/5 backdrop-blur-xl
                   border border-white/10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-purple-500/10 blur-[140px]" />

        <h1 className="text-4xl font-bold text-purple-300">
          Welcome, {data.team.team_name}
        </h1>

        <p className="text-gray-400 mt-2">
          Team ID: <span className="text-white">{data.team.teamid}</span>
        </p>
        <p className="text-gray-500">
          Leader: {data.team.leader_name}
        </p>
      </motion.div>

      {/* COUNTDOWN */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-purple-300">
          ⏳ Hackathon Countdown
        </h2>
        <CountdownTimer target="2026-02-05T23:59:59" />
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Status" value={data.team.status} />
        <StatCard title="Members" value={data.members} />
        <StatCard title="Submission" value={submissionStatus} />
        <StatCard title="Prize Pool" value="₹1,50,000" />
      </div>

      {/* ANNOUNCEMENTS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 rounded-3xl
                   bg-gradient-to-r from-purple-600/10 to-black
                   border border-purple-500/20"
      >
        <h2 className="text-2xl font-semibold mb-4">📢 Announcements</h2>

        <ul className="space-y-3 text-gray-300">
          <li>🚀 Final submission window opens tomorrow</li>
          <li>📅 Mentor session at 6 PM IST</li>
          <li>⚠️ Only GitHub links allowed for submissions</li>
        </ul>
      </motion.div>

      {/* DEADLINE */}
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <h3 className="text-lg font-semibold text-purple-300">
          ⏰ Submission Deadline
        </h3>
        <p className="text-gray-400 mt-1">
          5 February 2026 — 11:59 PM IST
        </p>
      </div>

    </div>
  );
}
