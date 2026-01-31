import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:5000";

// 💡 Added { isInternal } prop
export default function AdminChangePassword({ isInternal = false }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  // Get user from local storage if they just logged in
  const loggedInUser = JSON.parse(localStorage.getItem("adminUser"));

  const [user, setUser] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    // SCENARIO 1: Internal change (Logged in, forced change)
    if (isInternal && loggedInUser) {
      setUser({ name: loggedInUser.name, email: loggedInUser.email });
      return;
    }

    // SCENARIO 2: External change (Email link with token)
    if (token && token !== "null") {
      const fetchUser = async () => {
        try {
          const res = await fetch(`${API_BASE}/admin/invite/${token}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Invalid invite");
          setUser(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchUser();
    } else {
      setError("No valid session or token found.");
    }
  }, [token, isInternal]);

  // Strength logic...
  useEffect(() => {
    let s = 0;
    if (password.length >= 6) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[\W]/.test(password)) s += 1;
    setStrength(s);
  }, [password]);

  const submit = async () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      // 💡 Switch endpoint based on how we got here
      const url = isInternal 
        ? `${API_BASE}/admin/internal-reset` 
        : `${API_BASE}/invite/setup/${token}`;

      const body = isInternal 
        ? { password, adminId: loggedInUser?.id } 
        : { password, type: "admin" };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update");
      }

      // Update local storage so the flag is 0
      if (loggedInUser) {
        const updated = { ...loggedInUser, forcePasswordChange: 0 };
        localStorage.setItem("adminUser", JSON.stringify(updated));
      }

      setSuccess(true);
      setTimeout(() => navigate("/admin/dashboard"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <AnimatePresence>
        {!success ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 p-8 rounded-2xl w-full max-w-md text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-1">Welcome, {user.name || "Admin"}</h2>
            <p className="text-zinc-400 mb-6">Update your password to access your dashboard.</p>
            <div className="relative mb-4">
              <input type={showPassword ? "text" : "password"} placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-black/40 border border-white/10 rounded-lg focus:border-purple-500 outline-none transition-all" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-zinc-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="mb-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-2 transition-all ${strength <= 1 ? "bg-red-500 w-1/4" : strength === 2 ? "bg-yellow-400 w-2/4" : strength === 3 ? "bg-blue-400 w-3/4" : "bg-green-500 w-full"}`} />
            </div>
            {error && <p className="text-red-400 text-sm mb-4">⚠️ {error}</p>}
            <button onClick={submit} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 py-3 rounded-lg font-semibold transition-colors">
              {loading ? "Updating..." : "Set Password"}
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-600/20 border border-green-400 p-8 rounded-2xl w-full max-w-md flex flex-col items-center justify-center text-white shadow-lg">
            <CheckCircle size={48} className="mb-4 text-green-400" />
            <h2 className="text-2xl font-bold mb-2">Password Set!</h2>
            <p className="text-zinc-200 text-center">Entering dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}