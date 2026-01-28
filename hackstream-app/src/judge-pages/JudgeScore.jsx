"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiSend } from "react-icons/fi";

export default function JudgeScore() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [scores, setScores] = useState({
    innovation: 7,
    technical: 8,
    feasibility: 6,
    impact: 7,
    uiux: 8,
  });

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  /* ---------- FETCH TEAMS (FIXED) ---------- */
  useEffect(() => {
    const judgeId = localStorage.getItem("judge_id");

    if (!judgeId) {
      alert("Judge not logged in");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/judge/teams?judge_id=${judgeId}`)
      .then((res) => res.json())
      .then((data) => {
        setTeams(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setTeams([]);
        setLoading(false);
      });
  }, []);

  /* ---------- SUBMIT SCORE ---------- */
  const handleSubmitScore = async () => {
    if (!selectedTeam) return;

    try {
      const res = await fetch("http://localhost:5000/judge/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: selectedTeam.teamid,
          team_name: selectedTeam.team_name,
          score: totalScore,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Score submitted successfully");
        setSelectedTeam(null);

        // update local state so button turns green instantly
        setTeams((prev) =>
          prev.map((t) =>
            t.teamid === selectedTeam.teamid
              ? { ...t, status: "EVALUATED" }
              : t
          )
        );
      } else {
        alert(data.error || "Failed to submit score");
      }
    } catch {
      alert("Backend not responding");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Evaluate Teams</h1>

      {/* TEAM LIST */}
      {!selectedTeam && (
        <>
          {loading && <p>Loading teams…</p>}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div
                  key={team.teamid}
                  className="bg-white border rounded-xl p-5 shadow flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-semibold">{team.team_name}</h3>
                    <p className="text-sm text-gray-500">
                      Web / Full Stack
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <FiUsers /> 4 Members
                    </p>
                  </div>

                  <button
                    disabled={team.status === "EVALUATED"}
                    onClick={() => setSelectedTeam(team)}
                    className={`mt-4 py-2 rounded-lg font-semibold transition
                      ${
                        team.status === "EVALUATED"
                          ? "bg-green-600 text-white cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                  >
                    {team.status === "EVALUATED"
                      ? "Evaluated"
                      : "Evaluate"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* SCORING PAGE */}
      {selectedTeam && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              Evaluating: {selectedTeam.team_name}
            </h2>
            <button
              className="text-indigo-600 font-semibold"
              onClick={() => setSelectedTeam(null)}
            >
              ← Back
            </button>
          </div>

          <div className="bg-white border rounded-xl p-5 space-y-4">
            <h3 className="font-semibold">Scoring</h3>

            {rubric.map((item) => (
              <div key={item.key}>
                <div className="flex justify-between">
                  <span>{item.label}</span>
                  <span>{scores[item.key]}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores[item.key]}
                  onChange={(e) =>
                    setScores({
                      ...scores,
                      [item.key]: Number(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center bg-white border rounded-xl p-5">
            <div>
              <p className="text-sm text-gray-500">Total Score</p>
              <p className="text-2xl font-bold">{totalScore} / 50</p>
            </div>

            <button
              onClick={handleSubmitScore}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <FiSend /> Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- RUBRIC ---------- */

const rubric = [
  { key: "innovation", label: "Innovation" },
  { key: "technical", label: "Technical Execution" },
  { key: "feasibility", label: "Feasibility" },
  { key: "impact", label: "Impact" },
  { key: "uiux", label: "UI / UX" },
];
