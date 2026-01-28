import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";

export default function JudgeAnnouncement() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/announcements")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error("Error fetching announcements:", err));
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[#1E293B]">
          Announcements
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Official updates for judges and teams
        </p>
      </div>

      {/* Announcement List */}
      <div className="space-y-4">
        {announcements.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl p-6 border border-slate-300
              bg-[#E6E9EF] hover:shadow-md transition"
          >
            <div className="flex justify-between items-start gap-4">

              {/* Message */}
              <p className="text-sm text-slate-700">
                {item.message}
              </p>

              {/* Time */}
              <div className="flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap">
                <FiClock />
                {item.created_at.replace("GMT", "IST")}
              </div>

            </div>
          </motion.div>
        ))}

        {announcements.length === 0 && (
          <p className="text-sm text-slate-500">
            No announcements yet.
          </p>
        )}
      </div>

    </div>
  );
}
