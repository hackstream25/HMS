import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiHome, 
  FiUsers, 
  FiFileText, 
  FiBell, 
  FiSettings 
} from "react-icons/fi";
import { MdEvent } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { id: "overview", label: "Overview", icon: <FiHome /> },
  { id: "teams", label: "Teams", icon: <FiUsers />, path: "/judge/team" },
  { id: "score", label: "Score", icon: <FiUsers />, path: "/judge/score" },
  { id: "submission", label: "Submission", icon: <FiUsers />},
  { id: "announcements", label: "Announcements", icon: <FiBell /> },
  { id: "timeline", label: "Timeline", icon: <FiFileText /> },
  { id: "event", label: "Event", icon: <MdEvent />},
  { id: "settings", label: "Settings", icon: <FiSettings /> },
];

export default function Sidebar() {
  const [active, setActive] = useState("overview");
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white/5 backdrop-blur border-r border-white/10 p-6">
      <h2 className="text-xl font-bold tracking-wide text-white mb-8">
        HackStream
      </h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = active === item.id;

          return (
            <motion.div
              key={item.id}
              onClick={() => setActive(item.id) || (item.path && navigate(item.path))}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors
                ${isActive ? "bg-white/20 text-white font-semibold" : "text-zinc-300 hover:text-white"}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}