import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../assets/image.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login successful! Redirecting...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-[#0A0A0F]
      bg-[radial-gradient(circle_at_50%_-20%,_#2D1B4E_0%,_#0A0A0F_50%)] text-white">

      <div className="w-full max-w-md">

        
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="HackStream Logo"
            className="w-40 mb-2 object-contain
            drop-shadow-[0_0_12px_rgba(96,165,250,0.25)]"
            />




          
          <p className="text-gray-400 text-sm mt-1">
            Management System v2.0
          </p>
          <div className="w-14 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-70 mt-3" />
          
        </div>

        {/* Card */}
        <div className="rounded-[2rem] p-8 md:p-12
          bg-white/5 backdrop-blur-xl
          border border-white/10
          shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">

          <h2 className="text-2xl font-bold mb-2">Team Login</h2>
          <p className="text-gray-400 text-sm mb-8">
            Login to manage your hackathon activities.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Team ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. TEAM-1024"
                className="w-full px-5 py-3.5 rounded-xl text-white placeholder-gray-600
                  bg-white/5 border border-white/10
                  focus:border-purple-500 focus:bg-purple-500/5
                  focus:ring-4 focus:ring-purple-500/10
                  outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="team@hack.com"
                className="w-full px-5 py-3.5 rounded-xl text-white placeholder-gray-600
                  bg-white/5 border border-white/10
                  focus:border-purple-500 focus:bg-purple-500/5
                  focus:ring-4 focus:ring-purple-500/10
                  outline-none transition"
              />
            </div>

            <div className="relative">
  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">
    Password
  </label>

  <div className="relative flex items-center">
    <input
      type={showPassword ? "text" : "password"}
      required
      placeholder="••••••••"
      className="w-full px-5 py-3.5 rounded-xl text-white placeholder-gray-600 pr-12
        bg-white/5 border border-white/10
        focus:border-purple-500 focus:bg-purple-500/5
        focus:ring-4 focus:ring-purple-500/10
        outline-none transition"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 text-gray-400 hover:text-white transition"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
    </button>
  </div>
</div>


            <button
  type="submit"
  className="w-full py-4 rounded-xl font-bold text-white
    bg-gradient-to-r from-purple-600 to-indigo-600
    shadow-lg shadow-purple-500/20
    transition-all duration-300 ease-out
    hover:shadow-purple-500/40
    hover:-translate-y-1
    active:translate-y-0 active:shadow-purple-500/20"
>
  Login
</button>

          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-sm">
              New team?{" "}
              <span className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium transition">
                Create account
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
