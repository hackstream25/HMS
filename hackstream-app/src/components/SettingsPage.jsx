import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom"; // Use the context we created

const API_BASE = "http://localhost:5000";

export default function SettingsPage() {
  const { admin } = useOutletContext(); // Get real admin data
  const isSuperAdmin = admin?.role === "SUPER_ADMIN";

  const [maxTeams, setMaxTeams] = useState(50);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  // --- FETCH CONFIG (Only if Super Admin) ---
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${API_BASE}/hackathon/config`, { credentials: "include" });
        const data = await res.json();
        if (res.ok) setMaxTeams(data.maxTeams);
      } catch (err) {
        console.error("Failed to fetch config:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // --- HANDLE PASSWORD CHANGE ---
  const handlePasswordChange = async () => {
    setPwError("");
    setPwSuccess(false);

    if (newPassword.length < 8) {
      setPwError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Passwords do not match");
      return;
    }

    setPwSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      setPwSuccess(true);
      
      // Clear local storage and redirect
      setTimeout(() => {
        localStorage.removeItem("adminUser");
        window.location.href = "/admin/login";
      }, 2000);
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  };

  // --- HANDLE SYSTEM CONFIG SAVE ---
  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/update-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxTeams: maxTeams }),
        credentials: "include"
      });
      if (res.ok) alert("Hackathon configuration updated!");
      else alert("Failed to update config.");
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-zinc-500">Loading Settings...</div>;

  return (
    <div className="p-6 text-white max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* ================= HACKATHON CONFIG (Super Admin Only) ================= */}
      {isSuperAdmin && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-sky-400 font-bold mb-4 uppercase text-xs tracking-widest">System Control</h2>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="font-medium text-zinc-200">Maximum Teams Allowed</p>
              <p className="text-xs text-zinc-500">Limits the number of approved teams.</p>
            </div>
            <input
              type="number"
              value={maxTeams}
              onChange={(e) => setMaxTeams(Number(e.target.value))}
              className="w-24 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-right text-lg font-bold text-sky-400 focus:border-sky-400 outline-none"
            />
          </div>
          <button
            onClick={handleSaveConfig}
            disabled={saving}
            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition disabled:opacity-50"
          >
            {saving ? "Updating Config..." : "Save System Settings"}
          </button>
        </div>
      )}

      {/* ================= SECURITY (All Admins) ================= */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-red-400 font-bold mb-4 uppercase text-xs tracking-widest">Security & Account</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">New Password</label>
            <input
              type="password"
              placeholder="Min 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:border-sky-400 outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-500 block mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:border-sky-400 outline-none"
            />
          </div>

          {pwError && <p className="text-red-400 text-sm italic"> {pwError}</p>}
          {pwSuccess && <p className="text-green-400 text-sm font-medium">✅ Password changed! Logging out...</p>}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handlePasswordChange}
            disabled={pwSaving}
            className="w-full mt-2 py-3 rounded-xl font-bold bg-sky-400 text-black hover:bg-sky-300 disabled:opacity-50 shadow-lg shadow-sky-500/10"
          >
            {pwSaving ? "Changing Password..." : "Update Password"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}