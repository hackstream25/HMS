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
import { useState } from "react";

const items = [
  { id: "overview", label: "Overview", icon: <FiHome />, path: "/judge" },
  { id: "teams", label: "Teams", icon: <FiUsers />, path: "/judge/team" },
  { id: "score", label: "Score", icon: <FiFileText />, path: "/judge/score" },
  { id: "announce", label: "Announcements", icon: <FiBell />, path: "/judge/announcements" },
  { id: "event", label: "Event", icon: <MdEvent />, path: "/judge/event" },
  { id: "settings", label: "Settings", icon: <FiSettings /> ,path:"/judge/settings"},
];

export default function JudgeDock() {
  const [active, setActive] = useState("overview");
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex gap-6 px-6 py-4 rounded-2xl
          bg-[#E6E9EF]/95 backdrop-blur-xl
          border border-slate-300
          shadow-[0_20px_60px_rgba(30,58,138,0.25)]"
      >
        {items.map((item) => {
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActive(item.id);
                item.path && navigate(item.path);
              }}
              className="flex flex-col items-center gap-1 min-w-[60px]"
            >
              {/* Icon */}
              <div
                className={`text-xl p-3 rounded-xl transition-all
                  ${
                    isActive
                      ? "bg-[#1E3A8A] text-white shadow-md"
                      : "text-slate-500 hover:text-[#1E3A8A] hover:bg-slate-200"
                  }`}
              >
                {item.icon}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-medium tracking-wide
                  ${
                    isActive
                      ? "text-[#1E3A8A]"
                      : "text-slate-500"
                  }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
