import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut } from "react-icons/fi";

export default function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-end items-center px-6 py-3
      bg-slate-800 border-b border-white/10 relative">

      <div
        className="relative flex items-center space-x-3 cursor-pointer"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {/* Username */}
        <span className="text-zinc-300 font-medium">Admin</span>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-emerald-500
          flex items-center justify-center font-bold text-white
          ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-800
          transition-all duration-300">
          A
        </div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 w-52 bg-slate-900/95
                border border-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 z-10"
            >
              {/* User Info */}
              <div className="flex flex-col gap-1">
                <span className="text-white font-semibold">Admin User</span>
                <span className="text-sm text-zinc-400">admin@hackstream.com</span>
                <span className="mt-1 text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full inline-block">
                  Admin
                </span>
              </div>

              {/* Divider */}
              <div className="my-3 border-t border-white/10"></div>

              {/* Logout Button */}
              <button className="w-full flex items-center gap-2 text-red-400
                hover:text-red-300 transition-colors duration-200 px-2 py-2 rounded-lg">
                <FiLogOut /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}