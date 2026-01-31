import { motion } from "framer-motion";

export default function TeamDetailDemo() {
  const team = {
    id: "TEAM001",
    name: "Code Ninjas",
    status: "waiting",
    registeredAt: "12 Jan 2026, 10:42 AM",

    leader: {
      name: "John Doe",
      email: "leader1@gmail.com",
      phone: "+91 9876543210",
    },

    members: [
      { name: "John Doe", role: "Leader" },
      { name: "Alice", role: "Member" },
      { name: "Bob", role: "Member" },
      { name: "Charlie", role: "Member" },
    ],

    responses: {
      college: "XYZ University",
      track: "Web Development",
      experience: "Intermediate",
      reason:
        "We want to build a real-world solution and learn from mentors.",
    },
  };

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <p className="text-zinc-400 text-sm">Team ID: {team.id}</p>
        </div>

        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold
            ${
              team.status === "approved"
                ? "bg-green-500/20 text-green-400"
                : team.status === "waiting"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
        >
          {team.status}
        </span>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6"
      >
        {/* Leader */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Team Leader</h2>
          <div className="text-zinc-300 text-sm space-y-1">
            <p><strong>Name:</strong> {team.leader.name}</p>
            <p><strong>Email:</strong> {team.leader.email}</p>
            <p><strong>Phone:</strong> {team.leader.phone}</p>
          </div>
        </section>

        {/* Members */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Team Members</h2>
          <ul className="grid grid-cols-2 gap-3 text-sm">
            {team.members.map(m => (
              <li
                key={m.name}
                className="bg-black/30 border border-white/10 rounded-lg p-3"
              >
                <p className="font-medium">{m.name}</p>
                <p className="text-zinc-400">{m.role}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Form Responses */}
        <section>
          <h2 className="text-lg font-semibold mb-2">
            Registration Details
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-black/30 p-3 rounded-lg border border-white/10">
              <p className="text-zinc-400">College</p>
              <p>{team.responses.college}</p>
            </div>

            <div className="bg-black/30 p-3 rounded-lg border border-white/10">
              <p className="text-zinc-400">Track</p>
              <p>{team.responses.track}</p>
            </div>

            <div className="bg-black/30 p-3 rounded-lg border border-white/10">
              <p className="text-zinc-400">Experience</p>
              <p>{team.responses.experience}</p>
            </div>

            <div className="bg-black/30 p-3 rounded-lg border border-white/10 col-span-2">
              <p className="text-zinc-400">Why should we select you?</p>
              <p className="mt-1">{team.responses.reason}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 text-sm text-zinc-400">
          Registered on: {team.registeredAt}
        </div>
      </motion.div>
    </div>
  );
}
