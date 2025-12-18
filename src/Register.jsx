import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, School, Lock, ChevronRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    leaderName: '',
    email: '',
    contactNumber: '',
    college: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (formData.contactNumber.length !== 10)
      newErrors.phone = 'Enter a valid 10-digit number';
    if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert(`Account created for ${formData.leaderName}!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-600/10 blur-[160px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >

        {/* LOGO SECTION (MOVED UP) */}
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

        {/* FORM CARD (SMALLER + PRO TOUCH OVERLAP) */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]
                        rounded-[2.2rem] p-6 md:p-8 shadow-2xl 
                        max-w-md mx-auto -mt-10">

          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Team Leader Signup
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              Start your journey with HackStream today.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Leader Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1 tracking-wider">
                Leader Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="leaderName"
                  required
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl
                             py-3.5 pl-12 pr-4 focus:border-purple-500
                             focus:bg-purple-500/5 outline-none transition-all
                             placeholder-gray-600"
                />
              </div>
            </div>

            {/* Email + Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-1 tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@company.com"
                    onChange={handleChange}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl
                               py-3.5 pl-12 pr-4 focus:border-purple-500
                               focus:bg-purple-500/5 outline-none transition-all
                               placeholder-gray-600"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-1 tracking-wider">
                  Contact
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="tel"
                    name="contactNumber"
                    required
                    placeholder="10-digit number"
                    onChange={handleChange}
                    className={`w-full bg-white/[0.05] border rounded-xl
                                py-3.5 pl-12 pr-4 outline-none transition-all
                                placeholder-gray-600
                                ${errors.phone
                                  ? 'border-red-500'
                                  : 'border-white/10 focus:border-purple-500'}`}
                  />
                </div>
              </div>
            </div>

            {/* Institute */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1 tracking-wider">
                Institute
              </label>
              <div className="relative">
                <School className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="college"
                  required
                  placeholder="University Name"
                  onChange={handleChange}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl
                             py-3.5 pl-12 pr-4 focus:border-purple-500
                             focus:bg-purple-500/5 outline-none transition-all
                             placeholder-gray-600"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1 tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className={`w-full bg-white/[0.05] border rounded-xl
                              py-3.5 pl-12 pr-4 outline-none transition-all
                              placeholder-gray-600
                              ${errors.password
                                ? 'border-red-500'
                                : 'border-white/10 focus:border-purple-500'}`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] ml-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600
                         py-3.5 rounded-xl font-bold flex items-center
                         justify-center gap-2 shadow-lg shadow-purple-500/20
                         hover:shadow-purple-500/40 transition-all text-base mt-3"
            >
              Join HackStream <ChevronRight size={18} />
            </motion.button>

          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            Already registered?{' '}
            <span className="text-purple-400 cursor-pointer hover:underline font-medium">
              Log in
            </span>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;
