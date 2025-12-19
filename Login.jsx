import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../assets/image.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login successful!");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] 
                      bg-purple-600/10 blur-[160px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="HackStream Logo"
            className="w-36 object-contain
                       drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          />
          <p className="text-gray-400 text-sm mt-2">
            Management System v2.0
          </p>
          <div className="w-14 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-70 mt-3" />
        </div>

        {/* CARD */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10
                        rounded-[2rem] p-8 shadow-2xl">

          <h2 className="text-2xl font-bold mb-2 text-center">
            Team Login
          </h2>
          <p className="text-gray-400 text-sm mb-8 text-center">
            Login to manage your hackathon activities
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* TEAM ID */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                Team ID
              </label>
              <div className="relative mt-1">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  required
                  placeholder="e.g. TEAM-1024"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl
                             py-3.5 pl-12 pr-4 outline-none
                             focus:border-purple-500 focus:bg-purple-500/5
                             placeholder-gray-600 transition-all"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  required
                  placeholder="team@hack.com"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl
                             py-3.5 pl-12 pr-4 outline-none
                             focus:border-purple-500 focus:bg-purple-500/5
                             placeholder-gray-600 transition-all"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl
                             py-3.5 pl-12 pr-12 outline-none
                             focus:border-purple-500 focus:bg-purple-500/5
                             placeholder-gray-600 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600
                         py-4 rounded-xl font-bold
                         shadow-lg shadow-purple-500/25
                         hover:shadow-purple-500/40
                         transition-all"
            >
              Login
            </motion.button>

          </form>

          {/* FOOTER */}
          <p className="text-center text-gray-500 text-sm mt-6">
            New team?{" "}
            <span className="text-purple-400 hover:underline cursor-pointer font-medium">
              Create account
            </span>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;
