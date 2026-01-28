import JudgeTopbar from "./JudgeTopbar";
import JudgeDock from "./JudgeDock";
import { Outlet } from "react-router-dom";

export default function JudgeLayout() {
  return (
    <div className="min-h-screen bg-[#0B132B] flex flex-col">

      <JudgeTopbar />

      <main className="flex-1 flex justify-center px-6 py-10">
        <div
          className="w-full max-w-6xl
          bg-[#F1F3F6] rounded-3xl
          shadow-[0_40px_120px_rgba(0,0,0,0.35)]
          p-10 text-[#1E293B]"
        >
          <Outlet />
        </div>
      </main>

      <JudgeDock />
    </div>
  );
}
