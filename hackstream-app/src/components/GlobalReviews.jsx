import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export default function GlobalReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReview, setActiveReview] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/admin/global-reviews");
        // Sorting Newest First (Backend sends strings, so we parse to Date)
        const sortedData = res.data.sort((a, b) => 
          new Date(b.evaluatedAt) - new Date(a.evaluatedAt)
        );
        setReviews(sortedData);
      } catch (err) {
        console.error("Failed to load global reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Safeguard: Check if rubrics exist before calculating maxScore
  const maxScore = reviews[0]?.rubrics?.reduce((a, b) => a + b.max_score, 0) || 0;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Global Reviews</h1>

      {/* STATS - Fixed NaN by using totalScore and checking length */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat label="Reviewed Teams" value={reviews.length} />
        <Stat
          label="Avg Score"
          value={
            reviews.length > 0
              ? Math.round(reviews.reduce((a, b) => a + (b.totalScore || 0), 0) / reviews.length)
              : 0
          }
        />
        <Stat label="Max Possible" value={maxScore} />
        <Stat label="Timezone" value="IST" />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-sm">
          <thead className="bg-white/10 text-zinc-400">
            <tr>
              <th className="p-4 text-left">Team Name</th>
              <th className="p-4 text-left">Evaluated At</th>
              <th className="p-4 text-left">Judge</th>
              <th className="p-4 text-center">Total Score</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && reviews.map((r) => (
              <tr key={r.teamId} className="border-t border-white/10 hover:bg-white/5 transition">
                <td className="p-4 font-medium">{r.teamName}</td>
                <td className="p-4 text-zinc-400 font-mono text-xs">{r.evaluatedAt}</td>
                <td className="p-4">{r.judgeName}</td>
                <td className="p-4 text-center font-bold">
                  {/* Fixed: Use totalScore to match backend */}
                  <span className="text-emerald-400">{r.totalScore}</span>
                  <span className="text-zinc-500 text-xs ml-1">/ {maxScore}</span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => setActiveReview(r)}
                    className="text-sky-300 underline text-sm"
                  >
                    View Rubric
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {activeReview && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{activeReview.teamName}</h2>
                  <p className="text-sm text-zinc-500">{activeReview.evaluatedAt}</p>
                </div>
                <button onClick={() => setActiveReview(null)}>✕</button>
              </div>

              <div className="space-y-3 mb-6">
                {activeReview.rubrics.map((rubric, idx) => (
                  <div key={idx} className="flex justify-between bg-black/20 p-3 rounded border border-white/5">
                    <span className="text-zinc-300">{rubric.name}</span>
                    <span className="font-bold text-sky-400">
                      {/* Fixed: Use rubric.score to match backend */}
                      {rubric.score} <span className="text-zinc-600">/ {rubric.max_score}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-white/10 pt-4">
                <span className="text-zinc-400">Total Score</span>
                <p className="text-2xl font-bold text-emerald-400">
                  {activeReview.totalScore} <span className="text-zinc-600 text-lg">/ {maxScore}</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 p-5 rounded-xl text-center">
      <p className="text-xs uppercase text-zinc-500 mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}