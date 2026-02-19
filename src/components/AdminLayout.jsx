import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet, useOutletContext } from "react-router-dom";

export default function AdminLayout() {
  // 🔑 1. Catch the 'admin' data from ProtectedAdminRoute
  const context = useOutletContext(); 

  return (
    <div className="flex h-screen bg-slate-900 text-zinc-200">
      
      {/* 🔑 2. Pass the data to Sidebar so it can filter the menu */}
      <Sidebar admin={context?.admin} />

      <div className="flex-1 flex flex-col">
        <Topbar admin={context?.admin} />
        <main className="flex-1 overflow-y-auto p-8">
          {/* 🔑 3. Keep passing context to the nested pages (Teams, Judges, etc.) */}
          <Outlet context={context} />
        </main>
      </div>

    </div>
  );
}