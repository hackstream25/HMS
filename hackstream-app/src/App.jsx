import React from "react";
import { Routes, Route } from "react-router-dom";

/* ---------- PUBLIC ---------- */
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import LoginSelector from "./components/LoginSelector";
import Login from "./components/Login";

/* ---------- ADMIN ---------- */
import AdminLogin from "./components/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./components/AdminDashboard";

/* ---------- USER DASHBOARD ---------- */
import AppLayout from "./components/AppLayout";

/* Dashboard Pages */
import Dashboard from "./pages/Dashboard";
import Countdown from "./pages/Countdown";
import Submission from "./pages/Submission";
import Resources from "./pages/Resources";
import LiveStatus from "./pages/LiveStatus";
import Projects from "./pages/Projects";
import Results from "./pages/Results";

/* ---------- JUDGE ---------- */
import JudgeLayout from "./judge-pages/JudgeLayout";
import JudgeScore from "./judge-pages/JudgeScore";
import JudgeTeam from "./judge-pages/JudgeTeam";
import JudgeAnnouncement from "./judge-pages/JudgeAnnouncement";
import JudgeEvent from "./judge-pages/JudgeEvent";
import JudgeDock from "./judge-pages/JudgeDock";
import JudgeOverview from "./judge-pages/JudgeOverview";
import JudgeLogin from "./judge-pages/JudgeLogin";

function App() {
  return (
    <Routes>

      {/* ---------- PUBLIC ---------- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/selectlogin" element={<LoginSelector />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* ---------- ADMIN ---------- */}
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
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

      {/* ---------- JUDGE ---------- */}
      <Route path="/judgelogin" element={<JudgeLogin />} />
      <Route path="/judge" element={<JudgeLayout />}>
        <Route index element={<JudgeOverview />} />
        <Route path="team" element={<JudgeTeam />} />
        <Route path="/judge/score" element={<JudgeScore />} />
        <Route path="score/:teamid" element={<JudgeScore />} />
        <Route path="announcement" element={<JudgeAnnouncement />} />
        <Route path="event" element={<JudgeEvent />} />
        <Route path="dock" element={<JudgeDock />} />
        <Route path="settings"/>
      </Route>

    </Routes>
  );
}

export default App;
