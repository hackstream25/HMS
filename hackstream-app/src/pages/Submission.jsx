import axios from "axios";
import { useState } from "react";

export default function Submission() {
  const [link, setLink] = useState("");

  const submit = () => {
    axios.post("http://localhost:5000/api/submission", { link });
    alert("Submitted Successfully");
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-3xl font-bold">Project Submission</h1>

      <input
        className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
        placeholder="GitHub / Drive Link"
        onChange={(e) => setLink(e.target.value)}
      />

      <button
        onClick={submit}
        className="bg-purple-600 px-6 py-3 rounded-xl font-semibold"
      >
        Submit Project
      </button>
    </div>
  );
}
