import { getUser } from "../utils/getUser";
import { LogOut, Users } from "lucide-react";

export default function Topbar2() {
  const user = getUser();

  const logout = () => {
    localStorage.removeItem("hackstreamUser");
    window.location.href = "/login";
  };

  return (
    <div className="h-16 flex items-center justify-between px-6
                    border-b border-white/10 bg-black/40 backdrop-blur">

      <h1 className="text-xl font-semibold">
        HackStream Dashboard
      </h1>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Users size={18} />
          <span>{user?.teamName}</span>
          <span className="text-gray-500">({user?.teamId})</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1 text-red-400 hover:text-red-300"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
