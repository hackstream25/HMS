export default function Settings() {
  return (
    <div className="space-y-8 max-w-xl">
      <h1 className="text-3xl font-bold text-purple-300">
        ⚙️ Settings
      </h1>

      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <label className="block text-gray-400 mb-2">
          Team Display Name
        </label>
        <input
          className="w-full bg-black/40 border border-white/10
                     rounded-xl px-4 py-2 outline-none"
          placeholder="Team Name"
        />
      </div>

      <button
        className="bg-gradient-to-r from-purple-600 to-indigo-600
                   px-6 py-3 rounded-xl font-semibold"
      >
        Save Changes
      </button>
    </div>
  );
}
