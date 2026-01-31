import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  FiHome, FiUsers, FiUserCheck, FiFileText,
  FiBell, FiActivity, FiSettings, FiMenu,
} from "react-icons/fi";

const menuItems = [
  { id: "overview", label: "Overview", icon: <FiHome />, roles: ["admin", "superadmin"] },
  { id: "teams", label: "Teams", icon: <FiUsers />, roles: ["admin", "superadmin"] },
  { id: "judges", label: "Judges", icon: <FiUserCheck />, roles: ["admin", "superadmin"] },
  { id: "reviews", label: "Reviews", icon: <FiUserCheck />, roles: ["superadmin"] },
  { id: "users", label: "Users & Roles", icon: <FiUsers />, roles: ["superadmin"] },
  { id: "problem", label: "Problem Statements", icon: <FiFileText />, roles: ["admin", "superadmin"] },
  { id: "announcements", label: "Announcements", icon: <FiBell />, roles: ["admin", "superadmin"] },
  { id: "activity", label: "Activity Logs", icon: <FiActivity />, roles: ["superadmin"] },
  { id: "settings", label: "Settings", icon: <FiSettings />, roles: ["admin","superadmin"] },
];

export default function Sidebar() {
  const [active, setActive] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // 🔑 Get admin data from the Protected Route context
  const { admin } = useOutletContext();
  
  // Normalize the role string to match the 'menuItems' roles array
  // This handles "SUPER_ADMIN" -> "superadmin"
  const currentRole = admin?.role?.toLowerCase().replace("_", "") || "admin";

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      className="h-screen bg-white/5 backdrop-blur border-r border-white/10 p-4 flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        {!collapsed && <h2 className="text-xl font-bold text-white">HackStream</h2>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-zinc-300 hover:text-white">
          <FiMenu size={20} />
        </button>
      </div>

      <nav className="space-y-2">
        {menuItems
          // 🔑 Use the dynamic role from context!
          .filter(item => item.roles.includes(currentRole))
          .map(item => {
            const isActive = active === item.id;
            return (
              <motion.div
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  navigate(item.id === "overview" ? "/admin/dashboard" : `/admin/${item.id}`);
                }}
                whileHover={{ scale: 1.04 }}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition
                  ${isActive ? "bg-white/20 text-white font-semibold" : "text-zinc-300 hover:text-white"}`}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </motion.div>
            );
          })}
      </nav>
    </motion.aside>
  );
}