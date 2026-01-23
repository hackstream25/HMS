"use client";
import { motion } from "framer-motion";
import CircularStat from "../react-bits/CircularStat";
import { FiUsers, FiCheckCircle, FiShield, FiClock } from "react-icons/fi";

export default function AdminDashboard() {
  const teamLimit = 40;
  const approvedTeams = 27;
  const pendingTeams = teamLimit - approvedTeams;
  const judgesActive = 6;
  const readiness = 78;

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

      {/* Current Phase */}
      <motion.div
        className="mt-8 p-6 rounded-2xl 
          bg-slate-800/80 backdrop-blur 
          border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-sm text-zinc-300 font-medium">Current Phase</p>
        <h2 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
          <FiClock /> Registration Ongoing
        </h2>

        <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 transition-all duration-500"
            style={{ width: "70%" }}
          />
        </div>

        <p className="text-zinc-300 mt-2 text-sm font-medium">
          {approvedTeams} / {teamLimit} teams approved
        </p>
      </motion.div>

      {/* Circular Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <CircularStat
          title={<span className="flex items-center gap-2"><FiUsers /> Team Capacity</span>}
          value={approvedTeams}
          total={teamLimit}
          color="#34d399"
          subtitle="Approved Teams"
        />

        <CircularStat
          title={<span className="flex items-center gap-2"><FiCheckCircle /> Judges Onboarded</span>}
          value={judgesActive}
          total={10}
          color="#60a5fa"
          subtitle="Active Judges"
        />

        <CircularStat
          title={<span className="flex items-center gap-2"><FiShield /> System Readiness</span>}
          value={readiness}
          total={100}
          color="#facc15"
          subtitle="Setup Complete"
        />
      </div>

      {/* Useful Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 rounded-2xl 
          bg-slate-800/80 backdrop-blur 
          border border-white/10 hover:bg-slate-700 transition">
          <p className="text-sm text-zinc-300 font-medium flex items-center gap-2">
            <FiUsers /> Pending Approvals
          </p>
          <h2 className="text-3xl font-bold mt-2 text-amber-300">
            {pendingTeams}
          </h2>
          <p className="text-zinc-300 mt-1 text-sm font-medium">
            Teams awaiting verification
          </p>
        </div>

        <div className="p-6 rounded-2xl 
          bg-slate-800/80 backdrop-blur 
          border border-white/10 hover:bg-slate-700 transition">
          <p className="text-sm text-zinc-300 font-medium flex items-center gap-2">
            <FiCheckCircle /> Judge Allocation
          </p>
          <h2 className="text-3xl font-bold mt-2 text-sky-300">
            Balanced
          </h2>
          <p className="text-zinc-300 mt-1 text-sm font-medium">
            No panel overloaded
          </p>
        </div>

        <div className="p-6 rounded-2xl 
          bg-slate-800/80 backdrop-blur 
          border border-white/10 hover:bg-slate-700 transition">
          <p className="text-sm text-zinc-300 font-medium flex items-center gap-2">
            <FiClock /> Submission Readiness
          </p>
          <h2 className="text-3xl font-bold mt-2 text-emerald-300">
            Preparing
          </h2>
          <p className="text-zinc-300 mt-1 text-sm font-medium">
            Opens after registration closes
          </p>
        </div>
      </div>

      {/* Next Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <button className="bg-emerald-600/90 rounded-xl py-4 
          font-semibold hover:bg-emerald-600 transition 
          border border-white/10 shadow-md flex items-center justify-center gap-2">
          <FiCheckCircle /> Manage Team Approvals
        </button>

        <button className="bg-slate-700 rounded-xl py-4 
          font-semibold hover:bg-slate-600 transition 
          border border-white/10 shadow-md flex items-center justify-center gap-2">
          <FiCheckCircle /> Publish Problem Statements
        </button>

        <button className="bg-indigo-600/90 rounded-xl py-4 
          font-semibold hover:bg-indigo-600 transition 
          border border-white/10 shadow-md flex items-center justify-center gap-2">
          <FiUsers /> Add Core Team / Judges
        </button>
      </div>

    </div>
  );
}