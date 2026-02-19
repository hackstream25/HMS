import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";

import StatCard from "../components/StatCard";
import CountdownTimer from "../components/CountdownTimer";
import { getUser } from "../utils/getUser";

export default function Dashboard() {
  const user = getUser();
  const teamId = user?.teamid;

  const [data, setData] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("Pending");
  const [timeLeft, setTimeLeft] = useState({});

  const HACKATHON_END = new Date("2026-02-10T18:00:00");

  /* ---------------- FETCH DASHBOARD DATA ---------------- */
  useEffect(() => {
    if (!teamId) return;

    axios
      .get(`http://localhost:5000/dashboard/${teamId}`, {
        withCredentials: true
      })
      .then(res => setData(res.data))
      .catch(err => console.error(err));

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

  /* ---------------- SMART COUNTDOWN ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = HACKATHON_END - new Date();
      if (diff <= 0) return;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!data) return null;

  const { team, members } = data;
  const membersList = team.team_members || [];
  const isSubmitted =
    team.status === "SUBMITTED" || submissionStatus === "Submitted";

  /* ---------------- TEAM PROGRESS ---------------- */
  const progressSteps = [
    "Registered",
    "Team Created",
    "Members Added",
    "Project Submitted",
    "Under Review",
    "Results"
  ];

  const completedSteps = isSubmitted ? 4 : 3;

  return (
    <div className="space-y-12">

      {/* ---------------- HERO ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-8 rounded-3xl
                   bg-white/5 backdrop-blur-xl
                   border border-white/10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-purple-500/10 blur-[140px]" />

        <h1 className="text-4xl font-bold text-purple-300">
          Welcome, {team.team_name}
        </h1>

        <p className="text-gray-400 mt-2">
          Team ID: <span className="text-white">{team.teamid}</span>
        </p>
        <p className="text-gray-500">
          Leader: {team.leader_name}
        </p>
      </motion.div>

      {/* ---------------- TEAM PROGRESS TRACKER (ENHANCED) ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 p-10 rounded-3xl
                  border border-purple-500/20
                  shadow-[0_0_60px_rgba(168,85,247,0.15)]"
      >
        <h2 className="text-2xl font-bold mb-8 text-purple-300 flex items-center gap-2">
          🚀 Team Progress Tracker
        </h2>

        <div className="flex items-center justify-between gap-4">
          {progressSteps.map((step, i) => {
            const completed = i < completedSteps;
            return (
              <motion.div
                key={step}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 flex flex-col items-center text-center"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center
                    ${completed
                      ? "bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                      : "bg-white/10 text-gray-400"}`}
                >
                  {completed ? <CheckCircle size={28} /> : <Clock size={26} />}
                </div>

                <span className="text-sm mt-3 text-gray-300 font-medium">
                  {step}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>


    {/* ---------------- TEAM MEMBERS PREVIEW ---------------- */}
    <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
      <h2 className="text-xl font-semibold text-purple-300 mb-6 flex items-center gap-2">
        👥 Team Members
      </h2>

      <div className="flex flex-wrap gap-4">
        {/* LEADER */}
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-5 py-2 rounded-full
                    bg-gradient-to-r from-purple-600 to-indigo-600
                    text-white font-semibold shadow-lg"
        >
          👑 {team.leader_name}
        </motion.span>

        {/* MEMBERS */}
        {(
          Array.isArray(team.team_members)
            ? team.team_members
            : team.team_members
            ? JSON.parse(team.team_members)
            : []
        ).map((name, i) => (
          <motion.span
            key={i}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="px-5 py-2 rounded-full
                      bg-white/10 text-gray-200
                      hover:bg-purple-500/20
                      transition"
          >
            {name}
          </motion.span>
        ))}
      </div>
    </div>



      {/* ---------------- STATS ---------------- */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Status" value={team.status} />
        <StatCard title="Members" value={members} />
        <StatCard title="Submission" value={submissionStatus} />
        <StatCard title="Prize Pool" value="₹1,50,000" />
      </div>

      {/* ---------------- RESULTS READINESS ---------------- */}
      <div className="bg-white/5 p-6 rounded-2xl border border-purple-500/20">
        <h2 className="text-lg font-semibold text-purple-300 mb-2">
          🏆 Results
        </h2>

        <p className="text-gray-400">
          Results will be announced after evaluation.
        </p>

        <p className="mt-2 text-sm text-purple-400">
          Stay tuned — your submission is under review ✨
        </p>
      </div>

      {/* ---------------- ANNOUNCEMENTS ---------------- */}
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

      {/* ---------------- DEADLINE ---------------- */}
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