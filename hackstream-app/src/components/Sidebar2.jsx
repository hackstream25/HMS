import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  Upload,
  Folder,
  Activity,
  Code2,
  Trophy,
  Settings,
  LogOut
} from "lucide-react";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
   ${isActive ? "bg-purple-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`;

export default function Sidebar2() {
  return (
    <aside className="w-64 min-h-screen bg-[#0A0A0F] border-r border-white/10 flex flex-col p-5">
      <h2 className="text-2xl font-bold text-purple-400 mb-8">HackStream</h2>

      <nav className="flex-1 space-y-2">
        <NavLink to="/dashboard" end className={linkClass}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/dashboard/countdown" className={linkClass}>
          <Clock size={18} /> Countdown
        </NavLink>

        <NavLink to="/dashboard/submission" className={linkClass}>
          <Upload size={18} /> Submission
        </NavLink>

        <NavLink to="/dashboard/resources" className={linkClass}>
          <Folder size={18} /> Resources
        </NavLink>

        <NavLink to="/dashboard/status" className={linkClass}>
          <Activity size={18} /> Live Status
        </NavLink>

        <NavLink to="/dashboard/projects" className={linkClass}>
          <Code2 size={18} /> Projects
        </NavLink>

        <NavLink to="/dashboard/results" className={linkClass}>
          <Trophy size={18} /> Results
        </NavLink>

        <NavLink to="/dashboard/settings" className={linkClass}>
          <Settings size={18} /> Settings
        </NavLink>
      </nav>

      <button className="mt-auto flex items-center gap-2 text-red-400 hover:text-red-300">
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}
