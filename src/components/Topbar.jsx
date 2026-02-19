import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut } from "react-icons/fi";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({ name: "Admin", email: "", role: "ADMIN" });

  useEffect(() => {
    // Get the user data stored during login
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include"
    });
    localStorage.removeItem("adminUser"); // Clear local storage
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex justify-end items-center px-6 py-3 bg-slate-800 border-b border-white/10 relative">
      <div
        className="relative flex items-center space-x-3 cursor-pointer"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Dynamic Name */}
        <span className="text-zinc-300 font-medium">{user.name}</span>

        {/* Dynamic Avatar (First letter of name) */}
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-800">
          {user?.name?.charAt(0)?.toUpperCase() || "A"}

        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-12 w-52 bg-slate-900/95 border border-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 z-10"
            >
              <div className="flex flex-col gap-1">
                <span className="text-zinc-300 font-medium">
  {user?.name || "Admin"}
</span>

                <span className="text-sm text-zinc-400">{user.email}</span>
                <span className="mt-1 text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full w-fit">
                  {user.role.replace("_", " ")}
                </span>
              </div>
              <div className="my-3 border-t border-white/10"></div>
              <button className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 px-2 py-2" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}