import { motion } from "framer-motion";
import { FiClock, FiMapPin } from "react-icons/fi";

const events = [
  {
    id: 1,
    title: "Opening Ceremony",
    time: "09:00 AM – 09:30 AM",
    location: "Main Auditorium",
    status: "completed",
  },
  {
    id: 2,
    title: "Idea Submission Deadline",
    time: "12:00 PM",
    location: "Online Portal",
    status: "completed",
  },
  {
    id: 3,
    title: "Mentoring Round",
    time: "02:00 PM – 04:00 PM",
    location: "Mentor Rooms",
    status: "live",
  },
  {
    id: 4,
    title: "Final Pitch Round",
    time: "06:00 PM – 07:30 PM",
    location: "Main Stage",
    status: "upcoming",
  },
];

const statusStyle = {
  completed: {
    badge: "bg-slate-300 text-slate-600",
    line: "bg-slate-300",
  },
  live: {
    badge: "bg-blue-100 text-blue-700",
    line: "bg-blue-500",
  },
  upcoming: {
    badge: "bg-indigo-100 text-indigo-700",
    line: "bg-indigo-400",
  },
};

export default function JudgeEvent() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-[#1E293B]">
          Event Timeline
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Hackathon schedule and milestones
        </p>
      </div>

      {/* Timeline */}
      <div className="relative pl-8 space-y-6">
        {/* Vertical Line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-300" />

        {events.map((event, index) => {
          const style = statusStyle[event.status];

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="relative"
            >
              {/* Dot */}
              <div
                className={`absolute -left-1.5 top-4 w-4 h-4 rounded-full
                ${style.line}`}
              />

              {/* Card */}
              <div className="bg-[#E6E9EF] border border-slate-300
                rounded-2xl p-6 hover:shadow-md transition">

                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-[#1E293B]">
                      {event.title}
                    </h3>

                    <div className="mt-2 flex flex-col gap-1 text-sm text-slate-600">
                      <span className="flex items-center gap-2">
                        <FiClock /> {event.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <FiMapPin /> {event.location}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full
                    ${style.badge}`}
                  >
                    {event.status.toUpperCase()}
                  </span>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
