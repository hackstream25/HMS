import Sidebar2 from "./Sidebar2";
import Topbar2 from "./Topbar2";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#0D0D16] to-black text-white">
      <Sidebar2 />

      <div className="flex-1 flex flex-col">
        <Topbar2 />

        <motion.main
          className="flex-1 p-8 overflow-y-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AppLayout;
