import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000", withCredentials: true });

export default function JudgeScore() {
  const location = useLocation();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [scores, setScores] = useState({}); // { rubric_id: score_value }
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

        // Auto-select team if passed from the Team list via state
        if (location.state?.teamId) {
          const team = tRes.data.find(t => t.id === location.state.teamId);
          if (team) handleTeamChange(team.id, tRes.data);
        }
      } catch (err) { console.error("Fetch error", err); }
    };
    fetchData();
  }, [location.state]);

  // When a team is selected, fetch their specific scores
  const handleTeamChange = async (teamId, teamList = teams) => {
    const team = teamList.find(t => t.id == teamId);
    setSelectedTeam(team);
    
    if (team) {
      try {
        const res = await api.get(`/judge/team-scores/${teamId}`);
        // Transform [{rubric_id: 1, current_score: 5}, ...] into { 1: 5 }
        const scoreMap = {};
        res.data.forEach(item => {
          scoreMap[item.rubric_id] = item.current_score;
        });
        setScores(scoreMap);
      } catch (err) {
        console.error("Error loading scores", err);
      }
    }
  };

  const calculateTotal = () => Object.values(scores).reduce((a, b) => a + (Number(b) || 0), 0);

  const submitScores = async () => {
    if (!selectedTeam) return;
    if (window.confirm("Are you sure? This will lock the evaluation for this team.")) {
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
        navigate("/judge/team"); // Go back to the list
      } catch (err) {
        alert(err.response?.data?.error || "Submission failed");
      } finally { setLoading(false); }
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-[#1E293B]">Team Evaluation</h1>
        <p className="text-slate-500">Provide scores based on technical execution and innovation.</p>
      </header>

      {/* Select Team Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Select Team to Evaluate</label>
        <select
          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
          value={selectedTeam?.id || ""}
          onChange={e => handleTeamChange(e.target.value)}
        >
          <option value="">-- Choose a team --</option>
          {teams.map(t => (
            <option key={t.id} value={t.id}>
              {t.team_name} {t.status === 'EVALUATED' ? "✅ (Locked)" : ""}
            </option>
          ))}
        </select>
      </div>

      {selectedTeam && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="grid gap-4">
            {rubrics.map(r => (
              <div key={r.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">{r.name}</h3>
                  <p className="text-xs text-slate-400">Weightage: {r.max_score} points</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    disabled={selectedTeam.status === 'EVALUATED'}
                    className="w-20 p-2 text-center text-lg font-bold bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-blue-500 outline-none"
                    value={scores[r.id] || ""}
                    onChange={e => setScores({ ...scores, [r.id]: Math.min(r.max_score, Math.max(0, Number(e.target.value))) })}
                  />
                  <span className="text-slate-400">/ {r.max_score}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Total Bar */}
          <div className="bg-[#1E3A8A] text-white rounded-2xl p-6 flex justify-between items-center shadow-xl">
            <div>
              <p className="text-blue-200 text-xs uppercase font-bold tracking-widest">Calculated Total</p>
              <h2 className="text-4xl font-black">{calculateTotal()}</h2>
            </div>
            
            {selectedTeam.status !== 'EVALUATED' ? (
              <button
                onClick={submitScores}
                disabled={loading}
                className="bg-white text-[#1E3A8A] px-10 py-3 rounded-xl font-bold hover:bg-blue-50 transition active:scale-95 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Lock Evaluation"}
              </button>
            ) : (
              <div className="bg-green-500/20 border border-green-500 px-4 py-2 rounded-lg text-green-300 font-bold">
                EVALUATION LOCKED
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}