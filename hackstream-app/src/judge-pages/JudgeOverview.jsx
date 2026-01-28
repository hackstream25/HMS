import { motion } from "framer-motion";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiAward,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import JudgeAnnouncement from "./JudgeAnnouncement";
import JudgeEvent from "./JudgeEvent";

export default function JudgeOverview() {
  const [view, setView] = useState("phase");

  const [stats, setStats] = useState([
    { label: "Teams Registered", value: 0, icon: <FiUsers /> },
    { label: "Submissions Received", value: 41, icon: <FiCheckCircle /> }, // static
    { label: "Pending Reviews", value: 0, icon: <FiClock /> },
    { label: "Finalists Selected", value: 0, icon: <FiAward /> },
  ]);

  const [teams, setTeams] = useState([]);

  /* ---------- FETCH OVERVIEW STATS (DB-BASED) ---------- */
  useEffect(() => {
    fetch("http://localhost:5000/judge/overview")
      .then((res) => res.json())
      .then((data) => {
        setStats((prev) => [
          {
            label: "Teams Registered",
            value: data.teams_registered ?? 0,
            icon: <FiUsers />,
          },
          {
            label: "Submissions Received",
            value: data.submissions_received ?? 41,
            icon: <FiCheckCircle />,
          },
          {
            // placeholder, will be overridden after teams fetch
            label: "Pending Reviews",
            value: prev[2].value,
            icon: <FiClock />,
          },
          {
            label: "Reviews Completed",
            value: data.finalists_selected ?? 0,
            icon: <FiAward />,
          },
        ]);
      })
      .catch(() => {
        console.error("Failed to load judge overview stats");
      });
  }, []);

  /* ---------- FETCH TEAMS (AUTHORITATIVE FOR PENDING) ---------- */
  useEffect(() => {
    fetch("http://localhost:5000/judge/teams")
      .then((res) => res.json())
      .then((data) => {
        const teamList = Array.isArray(data) ? data : [];
        setTeams(teamList);

        const pendingCount = teamList.filter(
          (t) => t.status !== "EVALUATED"
        ).length;

        setStats((prev) => [
          prev[0],
          prev[1],
          {
            label: "Pending Reviews",
            value: pendingCount,
            icon: <FiClock />,
          },
          prev[3],
        ]);
      })
      .catch(() => {
        console.error("Failed to load teams for pending count");
      });
  }, []);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[#1E293B]">
          Overview
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Hackathon status at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#E6E9EF] border border-slate-300
              rounded-2xl p-6 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#1E3A8A]/10
              flex items-center justify-center text-[#1E3A8A] text-xl">
              {item.icon}
            </div>

            <div>
              <p className="text-sm text-slate-500">
                {item.label}
              </p>
              <p className="text-2xl font-semibold text-[#1E293B]">
                {item.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Status + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Live Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-[#E6E9EF]
            border border-slate-300 rounded-2xl p-6"
        >
          {view === "phase" && (
            <>
              <h3 className="font-semibold text-[#1E293B] mb-4">
                Current Phase
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-[#1E3A8A]">
                    Mentoring Round
                  </p>
                  <p className="text-sm text-slate-500">
                    Ends in 1 hour 24 minutes
                  </p>
                </div>

                <span className="px-4 py-1.5 rounded-full
                  bg-blue-100 text-blue-700 text-sm font-medium">
                  LIVE
                </span>
              </div>
            </>
          )}

          {view === "announcements" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1E293B]">
                  Announcements
                </h3>

                <button
                  onClick={() => setView("phase")}
                  className="text-sm text-blue-700 hover:underline"
                >
                  Back
                </button>
              </div>

              <div className="max-h-[260px] overflow-y-auto pr-2">
                <JudgeAnnouncement />
              </div>
            </>
          )}

          {view === "timeline" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1E293B]">
                  Events
                </h3>

                <button
                  onClick={() => setView("phase")}
                  className="text-sm text-blue-700 hover:underline"
                >
                  Back
                </button>
              </div>

              <div className="max-h-[260px] overflow-y-auto pr-2">
                <JudgeEvent />
              </div>
            </>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[#E6E9EF] border border-slate-300
            rounded-2xl p-6"
        >
          <h3 className="font-semibold text-[#1E293B] mb-4">
            Quick Actions
          </h3>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setView("phase")}
              className={`w-full text-left px-4 py-2 rounded-xl transition
                ${view === "phase"
                  ? "bg-[#1E3A8A] text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
            >
              Review Pending Teams
            </button>

            <button
              onClick={() => setView("announcements")}
              className={`w-full text-left px-4 py-2 rounded-xl transition
                ${view === "announcements"
                  ? "bg-[#1E3A8A] text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
            >
              View Announcements
            </button>

            <button
              onClick={() => setView("timeline")}
              className={`w-full text-left px-4 py-2 rounded-xl transition
                ${view === "timeline"
                  ? "bg-[#1E3A8A] text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
            >
              Event Timeline
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
