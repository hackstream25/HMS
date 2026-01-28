import { useState } from "react";
import axios from "axios";
import { getUser } from "../utils/getUser";

export default function Projects() {
  const user = getUser();

  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    github: "",
    demo: ""
  });

  const submitProject = async () => {
    await axios.post("http://localhost:5000/api/submissions", {
      teamid: user.teamId,
      teamname: user.teamName,
      ...form
    });

    alert("Project submitted successfully");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Project Details</h1>

      {[
        ["Project Title", "title"],
        ["Short Description", "description"],
        ["Tech Stack (comma separated)", "techStack"],
        ["GitHub Repo Link", "github"],
        ["Live Demo / Drive Link", "demo"]
      ].map(([label, key]) => (
        <input
          key={key}
          placeholder={label}
          className="w-full p-4 rounded-xl bg-black/40
                     border border-white/10 focus:border-purple-500"
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ))}

      <button
        onClick={submitProject}
        className="w-full bg-purple-600 py-3 rounded-xl
                   font-semibold hover:bg-purple-700 transition"
      >
        Submit Project
      </button>
    </div>
  );
}
