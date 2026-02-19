import { useState, useEffect } from "react";
import axios from "axios";
import { getUser } from "../utils/getUser";

export default function Submission() {
  const user = getUser();
  const teamId = user?.teamid;

  const [form, setForm] = useState({
    title: "",
    description: "",
    problem_statement: "",
    tech_stack: "",
    github_link: "",
    demo_link: "",
    video_link: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // 🔒 Check submission status
  useEffect(() => {
    if (!teamId) return;

    axios
      .get(`http://localhost:5000/submission/status/${teamId}`, {
        withCredentials: true
      })
      .then(res => setSubmitted(res.data.submitted))
      .catch(err => console.error(err));
  }, [teamId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    if (!teamId) {
      setError("Team ID missing");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/submission",
        { teamid: teamId, ...form },
        { withCredentials: true }
      );

      setSubmitted(true);

      // ✅ clear form
      setForm({
        title: "",
        description: "",
        problem_statement: "",
        tech_stack: "",
        github_link: "",
        demo_link: "",
        video_link: ""
      });

    } catch (err) {
      setError(err.response?.data?.error || "Submission failed");
    }
  };

  // 🔒 LOCKED UI
  if (submitted) {
    return (
      <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
        <h2 className="text-3xl font-bold text-green-400">
          ✅ Project Submitted
        </h2>
        <p className="text-gray-400 mt-2">
          Your submission is locked.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-8 rounded-3xl
                 bg-white/5 backdrop-blur-xl
                 border border-white/10"
    >
      <h2 className="text-3xl font-bold text-purple-400">
        Project Submission
      </h2>

      {error && <p className="text-red-400">❌ {error}</p>}

      {Object.keys(form).map(key => (
        <input
          key={key}
          name={key}
          value={form[key]}
          onChange={handleChange}
          placeholder={key.replaceAll("_", " ").toUpperCase()}
          className="w-full p-4 rounded-xl bg-black/40
                     border border-white/10 text-white"
          required
        />
      ))}

      <button
        type="submit"
        className="px-6 py-3 rounded-xl bg-purple-600
                   hover:bg-purple-700 transition"
      >
        Submit Project
      </button>
    </form>
  );
}