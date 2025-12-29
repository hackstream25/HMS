import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, CheckCircle, MessageSquare, ArrowRight } from 'lucide-react';

// Ensure these files are named .jsx in your src folder
import LiquidEther from './LiquidEther';
import ElectricBorder from './ElectricBorder';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden selection:bg-purple-500/30">
      
      {/* 1. LIQUID ETHER BACKGROUND (Refined Mouse Settings) */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <LiquidEther
          colors={[ '#5227FF', '#00D4FF', '#B19EEF' ]}
          mouseForce={16}      
          cursorSize={60}      
          isViscous={true}
          viscous={35}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          autoDemo={true}
          autoSpeed={0.4}
          autoIntensity={1.8}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/*ENHANCED NAVIGATION BAR */}
        <nav className="flex justify-between items-center px-12 py-10 max-w-[1700px] mx-auto w-full relative z-30">
          <div className="flex items-center">
            <Link to="/" className="group">
              <img 
                src="/logo5.png" 
                alt="HackStream Logo" 
                className="h-24 md:h-28 w-auto object-contain drop-shadow-[0_0_25px_rgba(138,43,226,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_40px_rgba(0,212,255,0.5)]" 
              />
            </Link>
          </div>
          
          {/* Restored Nav Links */}
          <div className="hidden lg:flex gap-16 text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 italic">
            <a href="#" className="hover:text-white hover:tracking-[0.5em] transition-all duration-300">Features</a>
            <a href="#" className="hover:text-white hover:tracking-[0.5em] transition-all duration-300">Solutions</a>
            <a href="#" className="hover:text-white hover:tracking-[0.5em] transition-all duration-300">Pricing</a>
          </div>
          
          <Link to="/register">
            <button className="px-10 py-3.5 rounded-full border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-500 active:scale-95">
              Log In
            </button>
          </Link>
        </nav>

        {/*HERO SECTION */}
        <section className="flex-grow flex flex-col items-center justify-center pt-10 pb-32 px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-10">
              Seamless Orchestration for <br /> 
              <span className="bg-gradient-to-r from-[#8A2BE2] via-[#00D4FF] to-[#8A2BE2] bg-clip-text text-transparent italic">
                Epic Hackathons.
              </span>
            </h1>
            
            <p className="mt-8 text-gray-500 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed font-medium tracking-wide">
              The premier ecosystem for visionaries. We handle the complexity <br className="hidden md:block"/> 
              so you can focus on building the next generation of technology.
            </p>

            <div className="mt-16 flex flex-col sm:flex-row justify-center gap-8">
              <Link to="/register">
                <button className="relative group px-14 py-6 bg-white text-black font-black rounded-[2rem] text-lg overflow-hidden transition-all hover:-translate-y-2 active:scale-95">
                  <span className="relative z-10">Sign Up for An Event</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
              <button className="px-14 py-6 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] font-black text-lg hover:bg-white/10 transition-all hover:-translate-y-2">
                Know More
              </button>
            </div>
          </motion.div>
        </section>

        {/* ELECTRIC FEATURE CARDS */}
        <section className="max-w-[1400px] mx-auto px-8 py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <FeatureCard 
              icon={<Zap size={32} />} 
              title="Rapid Registration" 
              desc="Intelligent custom forms with automated screening and one-click team formations." 
            />

            <FeatureCard 
              icon={<CheckCircle size={32} />} 
              title="Fair Judging" 
              desc="Rubric-based transparent scoring with real-time leaderboard synchronization." 
            />

            <FeatureCard 
              icon={<MessageSquare size={32} />} 
              title="Integrated Comms" 
              desc="Native Discord and Slack orchestrations for a unified participant experience." 
            />

          </div>
        </section>

        <footer className="py-20 text-center border-t border-white/5">
          <p className="text-[10px] font-black tracking-[0.6em] text-gray-600 uppercase italic">
            © 2025 HACKSTREAM — The Future of Management
          </p>
        </footer>
      </div>
    </div>
  );
};

// Premium Feature Card with Electric Border
const FeatureCard = ({ icon, title, desc }) => (
  <ElectricBorder
    color="#5227FF" // Purple electric glow for a modern touch
    speed={0.8}
    chaos={0.3}
    thickness={1.5}
    style={{ borderRadius: '3rem' }}
  >
    <div className="p-12 bg-black/60 backdrop-blur-3xl rounded-[3rem] h-full transition-all group border border-white/5">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-[1.5rem] flex items-center justify-center mb-10 text-purple-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-3xl font-extrabold mb-6 tracking-tighter">{title}</h3>
      <p className="text-gray-500 text-lg leading-relaxed font-medium group-hover:text-gray-300 transition-colors">
        {desc}
      </p>
      <div className="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Details <ArrowRight size={16} />
      </div>
    </div>
  </ElectricBorder>
);

export default LandingPage;