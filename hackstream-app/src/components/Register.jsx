import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, School, Lock, ChevronRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaderName: '',
    email: '',
    contactNumber: '',
    college: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (formData.contactNumber.length !== 10)
      newErrors.phone = 'Enter a valid 10-digit number';
    if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = 'Passwords do not match';

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

      {/* Back to Landing */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="absolute top-4 left-4 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                     bg-purple-500/10 text-purple-300
                     border border-purple-500/40
                     hover:bg-purple-500/20 hover:text-white
                     transition-all text-sm"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </motion.div>

      {/* Background Glow */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-600/10 blur-[160px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >

        {/* LOGO SECTION */}
        <div className="flex flex-col items-center -mt-6 mb-0 relative">
          <div className="absolute inset-0 bg-purple-500/20 blur-[50px] rounded-full" />
          <motion.img
            src="/logo5.png"
            alt="HackStream Logo"
            className="w-36 h-36 md:w-44 md:h-44 object-contain relative z-10"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate("/")}
            initial={{ filter: "drop-shadow(0 0 30px rgba(168,85,247,0.4))" }}
            whileHover={{ scale: 1.1, filter: "drop-shadow(0 0 40px rgba(0,212,255,0.5))" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* FORM CARD */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]
                        rounded-[2rem] p-4 md:p-5 shadow-2xl 
                        max-w-md mx-auto -mt-6">

          {/* Header */}
          <div className="mb-3 text-center">
            <h2 className="text-xl font-bold tracking-tight">Team Leader Signup</h2>
            <p className="text-gray-400 mt-1 text-sm">Start your journey with HackStream today.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-3">

            {/* Leader Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1 tracking-wider">Leader Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="leaderName"
                  required
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl
                             py-2 pl-10 pr-4 focus:border-purple-500
                             focus:bg-purple-500/5 outline-none transition-all
                             placeholder-gray-600 text-sm"
                />
              </div>
            </div>

            {/* Email + Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-1 tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="name@company.com"
                    onChange={handleChange}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl
                               py-2 pl-10 pr-4 focus:border-purple-500
                               focus:bg-purple-500/5 outline-none transition-all
                               placeholder-gray-600 text-sm"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-1 tracking-wider">Contact</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="tel"
                    name="contactNumber"
                    required
                    placeholder="10-digit number"
                    onChange={handleChange}
                    className={`w-full bg-white/[0.05] border rounded-xl
                                py-2 pl-10 pr-4 outline-none transition-all
                                placeholder-gray-600 text-sm
                                ${errors.phone ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                  />
                </div>
              </div>
            </div>

            {/* Institute */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1 tracking-wider">Institute</label>
              <div className="relative">
                <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  name="college"
                  required
                  placeholder="University Name"
                  onChange={handleChange}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl
                             py-2 pl-10 pr-4 focus:border-purple-500
                             focus:bg-purple-500/5 outline-none transition-all
                             placeholder-gray-600 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1 tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className={`w-full bg-white/[0.05] border rounded-xl
                              py-2 pl-10 pr-10 outline-none transition-all
                              placeholder-gray-600 text-sm
                              ${errors.password ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1 tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className={`w-full bg-white/[0.05] border rounded-xl
                              py-2 pl-10 pr-10 outline-none transition-all
                              placeholder-gray-600 text-sm
                              ${errors.confirmPassword ? 'border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-[10px] ml-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600
                         py-3 rounded-xl font-bold flex items-center
                         justify-center gap-2 shadow-lg shadow-purple-500/20
                         hover:shadow-purple-500/40 transition-all text-base mt-2"
            >
              Join HackStream <ChevronRight size={18} />
            </motion.button>

          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-4">
            Already registered?{' '}
            <Link to="/login" className="text-purple-400 hover:underline font-medium">
              Log in
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;