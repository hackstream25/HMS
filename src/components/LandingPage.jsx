import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout, Award, Bell, Users, ArrowRight } from 'lucide-react';
import LiquidEther from '../react-bits/LiquidEther';

const LandingPage = () => {
  const points = [
    {
      title: "Centralized Management",
      desc: "Manage problem statements, schedules, rules, prizes, and evaluation criteria from a single dashboard.",
      icon: <Layout size={28} />
    },
    {
      title: "Judge Evaluation",
      desc: "Rubric-based scoring with automatic rankings and transparent evaluation flow.",
      icon: <Award size={28} />
    },
    {
      title: "Announcements & Insights",
      desc: "Broadcast announcements and view real-time analytics on registrations and submissions.",
      icon: <Bell size={28} />
    },
    {
      title: "Team Management",
      desc: "Approve teams, track submissions, and monitor participation status effortlessly.",
      icon: <Users size={28} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white relative overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <LiquidEther
          autoIntensity={2.2}
          mouseForce={16}
          iterationsViscous={14}
          iterationsPoisson={14}
          colors={['#5227FF', '#00D4FF', '#B19EEF']}
        />
      </div>

      <div className="relative z-10">

        {/* NAVBAR */}
        <header className="fixed top-0 w-full z-50 px-6 py-6">
          <nav className="relative h-20 max-w-[1400px] mx-auto bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl px-10 py-5 flex justify-between items-center shadow-xl">
            
            <Link to="/">
              <img
                src="/logo5.png"
                alt="HackStream"
                className="h-30 w-auto auto scale-125"
                style={{transformOrigin:"left center"}}
              />
            </Link>

            <div className="hidden lg:flex gap-12 text-s font-semibold tracking-widest text-gray-400 uppercase">
              <a href="#features" className="hover:text-white">Features</a>
              <a href="#" className="hover:text-white">Solutions</a>
              <a href="#" className="hover:text-white">Pricing</a>
            </div>

            <Link to="/selectlogin">
              <button className="px-8 py-3 rounded-2xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition">
                Login
              </button>
            </Link>
          </nav>
        </header>

        {/* HERO */}
        <section className="pt-52 pb-24 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-8 italic">
              Seamless Orchestration <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent not-italic">
                Epic Hackathons
              </span>
            </h1>

            <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
              A unified platform to manage hackathons—from registrations and evaluations
              to announcements and analytics.
            </p>

            <div className="mt-14">
              <Link to="/selectlogin">
                <button className="px-12 py-5 bg-white text-black font-bold rounded-2xl text-lg hover:-translate-y-1 transition shadow-xl">
                  Sign Up for an Event
                </button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section id="features" className="max-w-[1400px] mx-auto px-8 py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {points.map((p, i) => (
              <FeatureCard key={i} {...p} />
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-16 text-center border-t border-white/10 bg-black/40">
          <p className="text-xs tracking-widest text-gray-600 uppercase">
            © 2025 HackStream — Built for Innovation
          </p>
        </footer>

      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="p-10 bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/10 hover:border-indigo-500/40 transition shadow-xl flex flex-col gap-6"
  >
    <div className="w-16 h-16 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-300">
      {icon}
    </div>

    <h3 className="text-xl font-bold italic">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>

    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-indigo-400 mt-auto">
      Learn More <ArrowRight size={16} />
    </div>
  </motion.div>
);

export default LandingPage;