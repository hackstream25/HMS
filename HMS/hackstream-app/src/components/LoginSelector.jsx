import React from 'react';
import { color, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Squares from '../react-bits/SquareBackground';
import { useNavigate } from "react-router-dom";
import TextType from '../react-bits/TextType';

const LoginSelector = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Squares Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares 
          speed={0.2} 
          squareSize={40}
          direction="diagonal"
          borderColor="#fff"
          hoverFillColor="#222"
        />
      </div>

      {/* Glow */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-600/10 blur-[160px] rounded-full pointer-events-none" />
      <TextType
        text="HackStream" 
        typingSpeed={75}
        pauseDuration={1500}
        showCursor={true}
        cursorCharacter="|"
        style={{color: 'white', fontSize: '12rem', fontWeight: 'bold', zindex: 20, position: 'absolute', top: '0%', left:'1%', opacity: 0.05}}
        />

      {/* Logo */}
      <div className="flex flex-col items-center -mt-8">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-[50px] rounded-full" />
          <motion.img
            src="/logo5.png"
            alt="HackStream Logo"
            className="w-44 h-44 md:w-52 md:h-52 object-contain relative z-10"
            style={{ cursor: "pointer", marginBottom: "-40px" }}
            onClick={() => navigate("/")}
            initial={{
              filter: "drop-shadow(0 0 30px rgba(168,85,247,0.4))",
            }}
            whileHover={{
              scale: 1.1,
              filter: "drop-shadow(0 0 40px rgba(0,212,255,0.5))",
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <p className="mt-4 text-sm text-white tracking-wide text-center relative z-20">
          Hackathon Management Portal
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]
                      rounded-xl p-6 shadow-2xl 
                      max-w-md w-full mt-6 relative z-10">
        <h2 className="text-2xl font-bold text-center mb-6">
          Select Login Type
        </h2>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600
                     py-3.5 rounded-xl font-bold flex items-center
                     justify-center gap-2 shadow-lg mb-4"
          onClick={() => navigate("/Register")}
        >
          User Login <ChevronRight size={18} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600
                     py-3.5 rounded-xl font-bold flex items-center
                     justify-center gap-2 shadow-lg"
          onClick={() => navigate("/AdminLogin")}
        >
          Admin Login <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default LoginSelector;
