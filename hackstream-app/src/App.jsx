import React from "react";
import { Routes, Route } from "react-router-dom";

/* ---------- PUBLIC ---------- */
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import LoginSelector from "./components/LoginSelector";
import Login from "./components/Login";

/* ---------- PORTAL SELECTOR ---------- */
import AdminPortalSelector from "./components/AdminPortalSelector";

/* ---------- ADMIN ---------- */
import AdminLogin from "./components/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Teams from "./components/Teams";
import Judges from "./components/Judges";
import UsersRoles from "./components/UsersRoles";
import GlobalReviews from "./components/GlobalReviews";
import ProblemStatements from "./components/ProblemStatements";
import Announcements from "./components/Announcements";
import ActivityLogPage from "./components/ActivityLogPage";
import SettingsPage from "./components/SettingsPage";
import AdminChangePassword from "./components/AdminChangePassword";

/* ---------- JUDGE ---------- */
import JudgeLogin from "./components/JudgeLogin";
import SetupJudgePassword from "./components/SetupJudgePassword";
import JudgeLayout from "./judge-pages/JudgeLayout";
import JudgeScore from "./judge-pages/JudgeScore";
import JudgeTeam from "./judge-pages/JudgeTeam";
import JudgeAnnouncement from "./judge-pages/JudgeAnnouncement";
import JudgeEvent from "./judge-pages/JudgeEvent";
import JudgeOverview from "./judge-pages/JudgeOverview";
import ProtectedJudgeRoute from "./components/ProtectedJudgeRoute";
import JudgeSettings from "./judge-pages/JudgeSettings";

/* ---------- USER DASHBOARD ---------- */
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Countdown from "./pages/Countdown";
import Submission from "./pages/Submission";
import Resources from "./pages/Resources";
import LiveStatus from "./pages/LiveStatus";
import Projects from "./pages/Projects";
import Results from "./pages/Results";

import { useOutletContext, Navigate } from "react-router-dom";

const SuperAdminOnly = ({ children }) => {
  const { admin } = useOutletContext();
  // Ensure the role check is consistent (matching your DB/Backend string)
  if (admin?.role !== "SUPER_ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* ---------- PUBLIC ---------- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/selectlogin" element={<LoginSelector />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* ---------- PORTAL SELECTOR ---------- */}
      <Route path="/admin-portal" element={<AdminPortalSelector />} />

      {/* ---------- LOGIN ---------- */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/judge/login" element={<JudgeLogin />} />

      {/* ---------- PASSWORD SETUP ---------- */}
      <Route path="/setup-password" element={<AdminChangePassword />} />
      <Route path="/setup-password/judge" element={<SetupJudgePassword />} />

      {/* ---------- ADMIN PANEL (PROTECTED) ---------- */}
      {/* ---------- ADMIN PANEL (PROTECTED) ---------- */}
<Route element={<ProtectedAdminRoute />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="teams" element={<Teams />} />
    <Route path="judges" element={<Judges />} />
    <Route path="settings" element={<SettingsPage />} />
    
    {/* 🔐 Super Admin Only Routes */}
    <Route path="users" element={<SuperAdminOnly><UsersRoles /></SuperAdminOnly>} />
    <Route path="reviews" element={<SuperAdminOnly><GlobalReviews /></SuperAdminOnly>} />
    <Route path="activity" element={<SuperAdminOnly><ActivityLogPage /></SuperAdminOnly>} />
    {/* <Route path="settings" element={<SuperAdminOnly><SettingsPage /></SuperAdminOnly>} /> */}
    
    <Route path="problem" element={<ProblemStatements />} />
    <Route path="announcements" element={<Announcements />} />
    <Route path="change-password" element={<AdminChangePassword isInternal={true} />} />
  </Route>
</Route>

      {/* ---------- JUDGE PANEL (PROTECTED) ---------- */}
      <Route element={<ProtectedJudgeRoute />}>
        <Route path="/judge" element={<JudgeLayout />}>
          <Route index element={<JudgeOverview />} />
          <Route path="team" element={<JudgeTeam />} />
          <Route path="score" element={<JudgeScore />} />
          <Route path="score/:teamid" element={<JudgeScore />} />
          <Route path="announcements" element={<JudgeAnnouncement />} />
          <Route path="event" element={<JudgeEvent />} />
          <Route path="settings" element={<JudgeSettings />} />

        </Route>
      </Route>

      {/* ---------- USER DASHBOARD ---------- */}
      <Route path="/dashboard" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="countdown" element={<Countdown />} />
        <Route path="submission" element={<Submission />} />
        <Route path="resources" element={<Resources />} />
        <Route path="status" element={<LiveStatus />} />
        <Route path="projects" element={<Projects />} />
        <Route path="results" element={<Results />} />
      </Route>
    </Routes>
  );
}

export default App;
