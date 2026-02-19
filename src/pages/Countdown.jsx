import CountdownTimer from "../components/CountdownTimer";

export default function Countdown() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Hackathon Countdown</h1>
      <CountdownTimer target="2026-02-10T09:00:00" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white/5 p-6 rounded-xl">📍 Venue: Main Auditorium</div>
        <div className="bg-white/5 p-6 rounded-xl">👥 Teams: 120+</div>
        <div className="bg-white/5 p-6 rounded-xl">🏆 Prize Pool: ₹1.5L</div>
      </div>
    </div>
  );
}