import { PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

export default function CircularStat({
  title,
  value,
  total,
  color,
  subtitle,
  light
}) {
  const data = [
    { name: "Used", value },
    { name: "Remaining", value: total - value }
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`border rounded-2xl p-6 flex flex-col items-center
        ${light ? "bg-white shadow-sm" : "bg-white/5"}
      `}
    >
      <p className="text-sm text-slate-500">{title}</p>

      <div className="relative mt-4">
        <PieChart width={160} height={160}>
          <Pie
            data={data}
            innerRadius={55}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}