import { CheckCircle, Clock, Rocket } from "lucide-react";

export default function Timeline() {
  const timeline = [
    {
      title: "Registration Open",
      date: "Jan 10, 2026",
      status: "done",
      icon: <CheckCircle />
    },
    {
      title: "Problem Statement Released",
      date: "Jan 15, 2026",
      status: "done",
      icon: <CheckCircle />
    },
    {
      title: "Project Submission Deadline",
      date: "Feb 10, 2026",
      status: "active",
      icon: <Clock />
    },
    {
      title: "Evaluation Phase",
      date: "Feb 11 – Feb 15",
      status: "upcoming",
      icon: <Rocket />
    },
    {
      title: "Results Announcement",
      date: "Feb 20, 2026",
      status: "upcoming",
      icon: <Rocket />
    }
  ];

  return (
    <div className="max-w-4xl space-y-10">
      <h1 className="text-3xl font-bold text-purple-300">
        🗓 Hackathon Timeline
      </h1>

      <div className="relative border-l border-white/10 pl-8 space-y-8">
        {timeline.map((step, i) => (
          <div
            key={i}
            className="relative group"
          >
            {/* Dot */}
            <div
              className={`absolute -left-[11px] top-1
                w-5 h-5 rounded-full flex items-center justify-center
                ${step.status === "done" && "bg-green-500"}
                ${step.status === "active" && "bg-purple-500 animate-pulse"}
                ${step.status === "upcoming" && "bg-gray-500"}
              `}
            >
              <span className="text-black scale-75">
                {step.icon}
              </span>
            </div>

            {/* Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10
                            hover:bg-white/10 hover:border-purple-500/40
                            transition-all duration-300">
              <h3 className="text-lg font-semibold">
                {step.title}
              </h3>
              <p className="text-sm text-gray-400">
                {step.date}
              </p>

              {step.status === "active" && (
                <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full
                                 bg-purple-600/20 text-purple-400">
                  Ongoing
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}