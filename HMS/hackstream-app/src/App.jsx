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
import Results from "./pages/Results";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";

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
        <Route path="results" element={<Results />} />
        <Route path="settings" element={<Settings />} />
        <Route path="announcements" element={<Announcements />} />
      </Route>

    </Routes>
  );
}

export default App;
