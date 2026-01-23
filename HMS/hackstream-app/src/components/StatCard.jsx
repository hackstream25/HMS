export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition">
      <h3 className="text-sm text-gray-400">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
