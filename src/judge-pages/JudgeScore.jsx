import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true
});

export default function JudgeScore() {
  const location = useLocation();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [scores, setScores] = useState({});
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tRes, rRes] = await Promise.all([
          api.get("/judge/teams"),
          api.get("/judge/rubrics")
        ]);

        setTeams(tRes.data);
        setRubrics(rRes.data);

        if (location.state?.teamId) {
          const team = tRes.data.find(t => t.id === location.state.teamId);
          if (team) handleTeamChange(team.id, tRes.data);
        }
      } catch (err) {
        console.error("Initial fetch error", err);
      }
    };

    fetchData();
  }, [location.state]);

  const handleTeamChange = async (teamId, teamList = teams) => {
    const team = teamList.find(t => t.id == teamId);
    setSelectedTeam(team);
    setSubmission(null);
    setScores({});

    if (!team) return;

    try {
      // Fetch existing scores
      const scoreRes = await api.get(`/judge/team-scores/${teamId}`);
      const scoreMap = {};
      scoreRes.data.forEach(item => {
        scoreMap[item.rubric_id] = item.current_score;
      });
      setScores(scoreMap);

      // Fetch submission links
      const subRes = await api.get(`/judge/submission/${teamId}`);
      setSubmission(subRes.data);
    } catch (err) {
      console.error("Error loading team data", err);
    }
  };

  const calculateTotal = () =>
    Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);

  const submitScores = async () => {
    if (!selectedTeam) return;

    if (!window.confirm("Are you sure? This will lock the evaluation for this team.")) return;

    try {
      setLoading(true);

      const payload = {
        team_id: selectedTeam.id,
        scores: Object.keys(scores).map(id => ({
          rubric_id: parseInt(id),
          score: scores[id]
        }))
      };

      await api.post("/judge/submit-score", payload);
      alert("Evaluation Locked Successfully!");
      navigate("/judge/team");
    } catch (err) {
      alert(err.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-[#1E293B]">Team Evaluation</h1>
        <p className="text-slate-500">
          Review submissions and score based on innovation & execution.
        </p>
      </header>

      {/* Team Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Select Team
        </label>
        <select
          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={selectedTeam?.id || ""}
          onChange={e => handleTeamChange(e.target.value)}
        >
          <option value="">-- Choose a team --</option>
          {teams.map(t => (
            <option key={t.id} value={t.id}>
              {t.team_name} {t.status === "EVALUATED" ? "✅ (Locked)" : ""}
            </option>
          ))}
        </select>
      </div>

      {selectedTeam && (
        <>
          {/* Submission Links */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-800">Project Submission</h3>

            <LinkRow label="GitHub" link={submission?.github_link} />
            <LinkRow label="Live Demo" link={submission?.demo_link} />
            <LinkRow label="Video Pitch" link={submission?.video_link} />
          </div>

          {/* Rubrics */}
          <div className="space-y-6">
            {rubrics.map(r => (
              <div
                key={r.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-slate-800">{r.name}</h3>
                  <p className="text-xs text-slate-400">
                    Max Score: {r.max_score}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    disabled={selectedTeam.status === "EVALUATED"}
                    value={scores[r.id] || ""}
                    className="w-20 p-2 text-center text-lg font-bold bg-slate-50 border-2 rounded-lg"
                    onChange={e =>
                      setScores({
                        ...scores,
                        [r.id]: Math.min(
                          r.max_score,
                          Math.max(0, Number(e.target.value))
                        )
                      })
                    }
                  />
                  <span className="text-slate-400">/ {r.max_score}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Bar */}
          <div className="bg-[#1E3A8A] text-white rounded-2xl p-6 flex justify-between items-center">
            <div>
              <p className="text-blue-200 text-xs uppercase font-bold">
                Total Score
              </p>
              <h2 className="text-4xl font-black">{calculateTotal()}</h2>
            </div>

            {selectedTeam.status !== "EVALUATED" ? (
              <button
                onClick={submitScores}
                disabled={loading}
                className="bg-white text-[#1E3A8A] px-10 py-3 rounded-xl font-bold"
              >
                {loading ? "Processing..." : "Lock Evaluation"}
              </button>
            ) : (
              <span className="text-green-300 font-bold">
                EVALUATION LOCKED
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function LinkRow({ label, link }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="font-semibold text-slate-600">{label}</span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 font-bold hover:underline"
        >
          Open
        </a>
      ) : (
        <span className="text-slate-400 italic">Not submitted</span>
      )}
    </div>
  );
}
