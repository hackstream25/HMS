import StatCard from "../components/StatCard";
import { getUser } from "../utils/getUser";

export default function Dashboard() {
  const user = getUser();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold">
          Welcome, {user?.teamName}
        </h1>
        <p className="text-gray-400 mt-2">
          Team ID: {user?.teamId}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Hackathon Status" value="LIVE" subtitle="You are participating" />
        <StatCard title="Submission Status" value="Pending" subtitle="Upload your project" />
        <StatCard title="Team Members" value="4" subtitle="Max 5 allowed" />
        <StatCard title="Prize Pool" value="₹1,50,000" subtitle="Top rewards" />
      </div>

      <div className="bg-gradient-to-r from-purple-600/10 to-black
                      border border-purple-500/20 p-8 rounded-2xl">
        <h2 className="text-2xl font-semibold">Important Notice</h2>
        <p className="text-gray-400 mt-2">
          Make sure your project submission is completed before the deadline.
        </p>
      </div>
    </div>
  );
}
