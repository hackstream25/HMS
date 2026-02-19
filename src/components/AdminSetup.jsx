import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API_BASE = "http://localhost:5000";

export default function AdminSetup() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [info, setInfo] = useState(null);
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/admin/invite/${token}`)
      .then(res => res.json())
      .then(setInfo);
  }, [token]);

  const submit = async () => {
    await fetch(`${API_BASE}/admin/invite/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setDone(true);
  };

  if (done) return <p className="p-6 text-white">✅ Account activated. You can log in.</p>;

  if (!info) return <p className="p-6 text-white">Loading invite…</p>;

  return (
    <div className="p-6 text-white max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">Welcome {info.name}</h1>
      <p className="text-zinc-400 mb-4">{info.email}</p>

      <input
        type="password"
        placeholder="Set password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full p-3 bg-black/40 rounded-lg mb-4"
      />

      <button
        onClick={submit}
        className="bg-sky-400/20 border border-sky-400/40 px-5 py-2 rounded-lg"
      >
        Activate Account
      </button>
    </div>
  );
}

