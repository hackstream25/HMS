import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:5000";

export default function SetupJudgePassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [judge, setJudge] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [strength, setStrength] = useState(0);

  // Fetch invited judge info based on token
  useEffect(() => {
    const fetchJudge = async () => {
      try {
        const res = await fetch(`${API_BASE}/judge/invite-info/${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Invalid or expired invite");
        setJudge(data);
      } catch (err) {
        setError(err.message);
      }
    };
    if (token) fetchJudge();
  }, [token]);

  // Password strength logic
  useEffect(() => {
    let s = 0;
    if (password.length >= 6) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[\W]/.test(password)) s += 1;
    setStrength(s);
  }, [password]);

  const submit = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/judge/setup-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set password");

      setSuccess(true);
      // Redirect to the Judge specific login page
      setTimeout(() => navigate("/judge/login"), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 text-white">
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-1">Welcome, {judge.name || "Judge"}</h2>
            <p className="text-zinc-400 mb-6 text-sm">Create your password to access the judging dashboard.</p>

            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 bg-black/40 border border-white/10 rounded-lg focus:border-sky-500 outline-none transition-all"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Strength Bar */}
            <div className="mb-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${(strength / 4) * 100}%`,
                  backgroundColor: strength <= 1 ? "#ef4444" : strength === 2 ? "#fbbf24" : strength === 3 ? "#38bdf8" : "#22c55e"
                }}
                className="h-full transition-all"
              />
            </div>

            {error && <p className="text-red-400 text-xs mb-4 flex items-center gap-1"><span>⚠️</span> {error}</p>}

            <button
              onClick={submit}
              disabled={loading || !token}
              className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-sky-900/20"
            >
              {loading ? "Activating..." : "Activate Account"}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-sky-500/10 border border-sky-500/50 p-8 rounded-2xl w-full max-w-md flex flex-col items-center justify-center text-white shadow-2xl"
          >
            <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-sky-500/40">
                <CheckCircle size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Account Verified!</h2>
            <p className="text-zinc-400 text-center">Your judge profile is now active. Redirecting you to login...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}