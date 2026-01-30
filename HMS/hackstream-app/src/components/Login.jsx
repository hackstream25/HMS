import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    teamid: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/login",
        {
          teamId: formData.teamid.trim(),   // ✅ FIXED
          password: formData.password       // ✅ FIXED
        },
        { withCredentials: true }
      );

      // Save user session
      localStorage.setItem("user", JSON.stringify(res.data));

      if (rememberMe) {
        localStorage.setItem("rememberEmail", formData.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center p-4 relative overflow-hidden">

      {/* Back Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="absolute top-4 left-4 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                     bg-purple-500/10 text-purple-300
                     border border-purple-500/40
                     hover:bg-purple-500/20 hover:text-white
                     transition-all text-sm"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </motion.div>

      {/* Background Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[450px] 
                      bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >

        {/* Logo */}
        <div className="flex flex-col items-center -mt-6 mb-2 relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-[50px] rounded-full" />
          <motion.img
            src="/logo5.png"
            alt="HackStream Logo"
            className="w-32 h-32 md:w-36 md:h-36 object-contain relative z-10"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.1 }}
          />
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10
                        rounded-[2rem] p-5 md:p-6 shadow-2xl">

          <h2 className="text-xl font-bold mb-1 text-center">Team Login</h2>
          <p className="text-gray-400 text-sm mb-5 text-center">
            Login to manage your hackathon activities
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* TEAM ID */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1">
                Team ID
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  required
                  value={formData.teamid}
                  onChange={(e) =>
                    setFormData({ ...formData, teamid: e.target.value })
                  }
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl
                             py-2.5 pl-10 pr-3 outline-none"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1">
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl
                             py-2.5 pl-10 pr-3 outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl
                             py-2.5 pl-10 pr-10 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600
                         py-3 rounded-xl font-bold"
            >
              Login
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
