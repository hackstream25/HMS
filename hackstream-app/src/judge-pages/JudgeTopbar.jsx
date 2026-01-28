import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function JudgeTopbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/judgelogin");
  };

  return (
    <div className="flex justify-between items-center px-10 py-4
      bg-[#E6E9EF] border-b border-slate-300">

      <h1 className="text-lg font-semibold tracking-wide text-[#1E3A8A]">
        HackStream - Judge Console
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">Judge</span>

        <div className="w-9 h-9 rounded-full bg-[#1E3A8A]
          flex items-center justify-center font-bold text-white">
          J
        </div>

        <button onClick={handleLogout}
        className="text-slate-400 hover:text-red-500 transition">
          <FiLogOut />
        </button>
      </div>
    </div>
  );
}
