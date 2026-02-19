export default function Announcements_user() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-purple-400 mb-6">
        📢 Announcements
      </h1>

      <div className="space-y-4">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
          🚨 Submission deadline extended to 11:59 PM
        </div>
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
          🎤 Final presentations start tomorrow
        </div>
      </div>
    </div>
  );
}