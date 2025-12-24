import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, School, Lock, ChevronRight } from 'lucide-react';
import Squares from './SquareBackground';
import { useNavigate } from "react-router-dom";

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
      {/* Background Glow */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-600/10 blur-[160px] rounded-full pointer-events-none" />

    {/*Logo*/}
      <div className="flex flex-col items-center -mt-8 mb-0">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/20 blur-[50px] rounded-full" />
            <img
              src="/logo5.png"
              alt="HackStream Logo"
              className="w-44 h-44 md:w-52 md:h-52 object-contain relative z-10 
                         drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            />
          </div>
        </div>

        {/*Main Card*/}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]
                        rounded-[1rem] p-6 md:p-8 shadow-2xl 
                        max-w-md mx-auto -mt-10">
            <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight" style={{marginBottom:'10%'}}>
              Select Login type
            </h2>
            <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600
                                     py-3.5 rounded-xl font-bold flex items-center
                                     justify-center gap-2 shadow-lg shadow-purple-500/20
                                     hover:shadow-purple-500/40 transition-all text-base mt-3"
                        onClick={() => navigate("/Register")}
                        >
                          User Login <ChevronRight size={18} />
            </motion.button>
            <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600
                                     py-3.5 rounded-xl font-bold flex items-center
                                     justify-center gap-2 shadow-lg shadow-purple-500/20
                                     hover:shadow-purple-500/40 transition-all text-base mt-3"
                        onClick={() => navigate("/AdminLogin")}
                        >
                          Admin Login <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
    </div>
  );
};

export default LoginSelector;
