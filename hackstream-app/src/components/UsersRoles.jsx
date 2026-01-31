import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const API_BASE = "http://localhost:5000";

export default function AdminManagement() {
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get current logged in user from storage
  const currentUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
  //console.log("Current User ID:", currentUser.id, "Role:", currentUser.role);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "ADMIN",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const superAdminCount = users.filter(
    (u) => u.role === "SUPER_ADMIN"
  ).length;

  /* ---------------- LOGIC ---------------- */

  const canRemoveUser = (targetUser) => {
  // 1. If the person logged in isn't a SUPER_ADMIN, they can't remove anyone
  if (currentUser.role !== "SUPER_ADMIN") return false;
  
  // 2. SELF-REMOVE PROTECTION
  // We use the email from localStorage (currentUser.email) 
  // to check if it matches the row email (targetUser.email)
  if (targetUser.email === currentUser.email) return false;
  
  // 3. LAST SUPER ADMIN PROTECTION
  if (targetUser.role === "SUPER_ADMIN" && superAdminCount === 1) return false;

  return true;
};

  /* ---------------- ACTIONS ---------------- */

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        credentials: "include",
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async () => {
    if (loading || !newUser.name || !newUser.email) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to add user");
        return;
      }
      fetchUsers();
      setNewUser({ name: "", email: "", role: "ADMIN" });
      setShowAdd(false);
      showToast("User invited successfully");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Remove failed");
        setConfirmRemove(null);
        return;
      }
      fetchUsers();
      setConfirmRemove(null);
      showToast("User removed successfully");
    } catch (err) {
      console.error("Failed to remove user", err);
    }
  };

  const resendInvite = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}/resend-invite`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to resend invite");
        return;
      }
      showToast("Invite email resent");
    } catch (err) {
      console.error("Resend failed", err);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Core Team Access</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat label="Total Users" value={users.length} />
        <Stat label="Admins" value={users.filter((u) => u.role === "ADMIN").length} />
        <Stat label="Super Admins" value={superAdminCount} />
      </div>

      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-lg">Users</h2>
        {currentUser.role === "SUPER_ADMIN" && (
          <button
            onClick={() => setShowAdd(true)}
            className="bg-sky-400/20 border border-sky-400/40 px-4 py-2 rounded-lg"
          >
            + Add User
          </button>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
  {users.map((u) => {
    // Calculate if the button should be disabled
    const isMe = u.email === currentUser.email;
  const isActionDisabled = !canRemoveUser(u);
    
    return (
      <div key={u.id} className="flex justify-between items-center px-4 py-3 border-b border-white/10">
        <div>
          <p className="font-medium">
            {u.name} 
            {isMe && <span className="text-[10px] text-zinc-500 ml-2 bg-white/10 px-2 py-0.5 rounded">(You)</span>}
          </p>
          <p className="text-xs text-zinc-400">{u.email}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              u.role === "SUPER_ADMIN" ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"
          }`}>
            {u.role.replace("_", " ")}
          </span>

          {/* Only Super Admins see the Resend button, and not for themselves */}
          {currentUser.role === "SUPER_ADMIN" && u.status === "INVITED" && !isMe && (
            <button onClick={() => resendInvite(u.id)} className="text-xs text-sky-400 hover:underline">
              Resend Invite
            </button>
          )}

          <button
          disabled={isActionDisabled}
          onClick={() => setConfirmRemove(u)}
          className={`text-sm font-medium transition-all ${
            isActionDisabled 
              ? "text-zinc-600 cursor-not-allowed opacity-30" 
              : "text-red-400 hover:text-red-300 hover:underline"
          }`}
        >
          {isMe ? "Locked" : "Remove"}
        </button>
        </div>
      </div>
    );
  })}
</div>
      <AnimatePresence>
        {showAdd && (
          <Modal title="Add New User" subtitle="Invite a core team member" onClose={() => setShowAdd(false)}>
            <div className="space-y-5">
              <Field
                label="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Dr. Neha Verma"
              />
              <Field
                label="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="email@college.edu"
              />
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <RoleOption
                    title="Admin"
                    desc="Core team access"
                    active={newUser.role === "ADMIN"}
                    onClick={() => setNewUser({ ...newUser, role: "ADMIN" })}
                  />
                  <RoleOption
                    title="Super Admin"
                    desc="Full system control"
                    active={newUser.role === "SUPER_ADMIN"}
                    onClick={() => setNewUser({ ...newUser, role: "SUPER_ADMIN" })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button onClick={() => setShowAdd(false)} className="text-zinc-400 hover:text-white">Cancel</button>
                <button
                  onClick={addUser}
                  disabled={loading}
                  className={`bg-sky-400/20 border border-sky-400/40 px-5 py-2 rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Adding..." : "Add User"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmRemove && (
          <Modal title="Confirm Removal" subtitle={`Remove ${confirmRemove.name}?`} onClose={() => setConfirmRemove(null)}>
            <p className="text-sm text-zinc-400 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmRemove(null)} className="text-zinc-400 hover:text-white">Cancel</button>
              <button
                onClick={() => removeUser(confirmRemove.id)}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
              >
                Remove
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-black/80 px-4 py-2 rounded-lg text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Stat({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Modal({ title, subtitle, children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800 rounded-2xl w-full max-w-md p-6"
      >
        <div className="flex justify-between mb-2">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {subtitle && <p className="text-sm text-zinc-400">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">✕</button>
        </div>
        <div className="mt-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm text-zinc-400 mb-1 block">{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-400/40"
      />
    </div>
  );
}

function RoleOption({ title, desc, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-3 rounded-lg border transition ${
        active ? "border-sky-400/50 bg-sky-400/10" : "border-white/10 hover:bg-white/5"
      }`}
    >
      <p className="font-medium">{title}</p>
      <p className="text-xs text-zinc-400">{desc}</p>
    </button>
  );
}