import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CountdownTimer({ target }) {
  const calc = () => {
    const diff = new Date(target) - new Date();
    if (diff <= 0) return null;

    return {
      Days: Math.floor(diff / 86400000),
      Hours: Math.floor(diff / 3600000) % 24,
      Minutes: Math.floor(diff / 60000) % 60,
      Seconds: Math.floor(diff / 1000) % 60
    };
  };

  const [time, setTime] = useState(calc());

  useEffect(() => {
    const i = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(i);
  }, []);

  if (!time) {
    return (
      <p className="text-green-400 text-3xl font-bold">
        🚀 Hackathon is LIVE
      </p>
    );
  }

  return (
    <div className="flex gap-8">
      {Object.entries(time).map(([k, v]) => (
        <motion.div
          key={k}
          className="bg-gradient-to-br from-purple-600/20 to-black
                     border border-purple-500/20
                     rounded-3xl px-8 py-6 text-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-5xl font-extrabold">{v}</div>
          <div className="text-sm tracking-widest text-gray-400 mt-1">{k}</div>
        </motion.div>
      ))}
    </div>
  );
}
