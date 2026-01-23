export default function Resources() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Resources</h1>

      {["Problem Statement", "API Docs", "Dataset"].map(r => (
        <div key={r} className="bg-white/5 p-6 rounded-xl">
          📄 {r}
        </div>
      ))}
    </div>
  );
}
