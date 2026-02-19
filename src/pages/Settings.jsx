import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import { getUser } from "../utils/getUser";

export default function Settings() {
  const user = getUser();
  const teamid = user?.teamid;

  const [memberName, setMemberName] = useState("");
  const [members, setMembers] = useState([]);
  const MAX_MEMBERS = 3;

  // 🔹 Load existing members
  useEffect(() => {
    if (!teamid) return;

    axios
      .get(`http://localhost:5000/dashboard/${teamid}`, {
        withCredentials: true
      })
      .then(res => {
        setMembers(res.data.team.team_members || []);
      });
  }, [teamid]);

  const addMember = async () => {
    if (!memberName.trim()) {
      alert("Enter member name");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/team/add",
        { teamid, name: memberName },
        { withCredentials: true }
      );

      setMembers(res.data.members);
      setMemberName("");

    } catch (err) {
      alert(err.response?.data?.error || "Failed to add member");
    }
  };

  return (
    <div className="space-y-8 max-w-xl">
      <h1 className="text-3xl font-bold text-purple-300">⚙️ Settings</h1>

      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4">
        <h2 className="text-lg font-semibold text-purple-300">
          Team Members ({members.length}/{MAX_MEMBERS})
        </h2>

        {/* EXISTING MEMBERS */}
        {members.map((m, i) => (
          <div
            key={i}
            className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white"
          >
            {m}
          </div>
        ))}

        {members.length < MAX_MEMBERS && (
          <>
            <input
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="Member Name"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2"
            />

            <button
              onClick={addMember}
              className="flex items-center gap-2 px-6 py-3 rounded-xl
                         bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              <Plus size={18} /> Add Member
            </button>
          </>
        )}
      </div>
    </div>
  );
}