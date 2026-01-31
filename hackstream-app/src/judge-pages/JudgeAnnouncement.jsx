import { useEffect, useState } from "react";
import { FiBell, FiChevronLeft } from "react-icons/fi";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000", withCredentials: true });

export default function JudgeAnnouncement({ onBack }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get("/judge/announcements");
        // The backend should return announcements where status is 'published'
        // and the visibility JSON has "judges": true
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-4">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-2"
        >
          <FiChevronLeft /> Back to Overview
        </button>
      )}

      {loading ? (
        <p className="text-center text-slate-500 text-sm">Loading announcements...</p>
      ) : announcements.length > 0 ? (
        announcements.map((ann) => (
          <div key={ann.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-blue-600">
                <FiBell />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800">{ann.title}</h4>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">
                    {new Date(ann.published_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {ann.message}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 bg-slate-100 rounded-xl">
          <p className="text-slate-500 text-sm">No announcements for judges at this time.</p>
        </div>
      )}
    </div>
  );
}