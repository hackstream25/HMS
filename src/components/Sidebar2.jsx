import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Clock, Upload, Folder,
  Activity, Trophy, Settings,
  Megaphone, LogOut, ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar2() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      className="min-h-screen bg-[#0A0A0F]
                 border-r border-white/10
                 flex flex-col p-4 backdrop-blur-xl"
    >
      {/* LOGO */}
      <div className="flex justify-center mb-6">
        <img
          src="/logo5.png"
          className={`transition-all ${collapsed ? "w-12" : "w-40"}`}
        />
      </div>

      {/* TOGGLE */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-6 flex justify-center text-purple-400"
      >
        <ChevronLeft
          className={`transition-transform ${collapsed && "rotate-180"}`}
        />
      </button>

      {/* LINKS */}
      <nav className="flex-1 space-y-1">
        {[
          ["Dashboard", LayoutDashboard, "/dashboard"],
          ["Countdown", Clock, "/dashboard/countdown"],
          ["Project Submission", Upload, "/dashboard/submission"],
          ["Resources", Folder, "/dashboard/resources"],
          ["Timeline", Folder, "/dashboard/timeline"],
          ["Live Status", Activity, "/dashboard/status"],
          ["Results", Trophy, "/dashboard/results"],
          ["Announcements", Megaphone, "/dashboard/announcements"],
          ["Settings", Settings, "/dashboard/settings"]
        ].map(([label, Icon, path]) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition
               ${
                 isActive
                   ? "bg-purple-600 text-white"
                   : "text-gray-400 hover:bg-white/5"
               }`
            }
          >
            <Icon size={18} />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <button className="mt-4 flex items-center gap-2 text-red-400">
        <LogOut size={18} /> {!collapsed && "Logout"}
      </button>
    </motion.aside>
  );
}