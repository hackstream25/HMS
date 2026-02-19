import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Gavel, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function AdminPortalSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-all"
        >
          <ArrowLeft size={20} /> Back to main
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">Staff Access</h1>
        <p className="text-zinc-500 text-center mb-12">Please select your authorization level to continue.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Admin Card */}
          <motion.div
            whileHover={{ y: -10, borderColor: 'rgba(168,85,247,0.4)' }}
            onClick={() => navigate("/admin/login")}
            className="bg-white/[0.03] border border-white/10 p-10 rounded-[2rem] cursor-pointer group transition-all text-center"
          >
            <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/20 transition-all">
              <ShieldCheck size={40} className="text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">System Admin</h3>
            <p className="text-zinc-400 text-sm">Manage hackathon settings, tracks, and invitations.</p>
          </motion.div>

          {/* Judge Card */}
          <motion.div
            whileHover={{ y: -10, borderColor: 'rgba(99,102,241,0.4)' }}
            onClick={() => navigate("/judge/login")}
            className="bg-white/[0.03] border border-white/10 p-10 rounded-[2rem] cursor-pointer group transition-all text-center"
          >
            <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-500/20 transition-all">
              <Gavel size={40} className="text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Event Judge</h3>
            <p className="text-zinc-400 text-sm">Access assigned teams and submit evaluation scores.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}