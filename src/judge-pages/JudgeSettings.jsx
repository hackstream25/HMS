import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

export default function JudgeSettings() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/judge/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      setSuccess(true);

      // ✅ LOGOUT FLOW
      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/judge/login";
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[#1E293B]">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your security preferences
        </p>
      </div>

      {/* Security Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#E6E9EF] border border-slate-300 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
            <ShieldCheck />
          </div>
          <div>
            <h3 className="font-semibold text-[#1E293B]">Change Password</h3>
            <p className="text-xs text-slate-500">
              You will be logged out after updating
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-sm">
          
          {/* New Password */}
          <div className="relative">
            <label className="text-xs text-slate-600">New Password</label>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
            />
          </div>

          {/* Confirm */}
          <div className="relative">
            <label className="text-xs text-slate-600">Confirm Password</label>
            <input
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
            />
          </div>

          {/* Toggle */}
          <button
            onClick={() => setShow(!show)}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
            {show ? "Hide password" : "Show password"}
          </button>

          {error && <p className="text-sm text-red-500">⚠️ {error}</p>}
          {success && (
            <p className="text-sm text-green-600">
              ✅ Password updated. Logging out…
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={submit}
            disabled={saving}
            className="mt-4 w-full bg-[#1E3A8A] text-white py-3 rounded-xl font-semibold
                       hover:bg-[#1C357A] disabled:opacity-50"
          >
            {saving ? "Updating..." : "Change Password"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
