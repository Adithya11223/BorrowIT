// Register.jsx - Premium Responsive Split-Screen Auth Sign-Up Page for BorrowIT

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Logo from '../components/Logo';
import AuthAnimation from '../components/AuthAnimation';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const { register, socialLogin } = useApp();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      setError('');
      await register(fullName, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setLoading(true);
      setError('');
      await socialLogin(provider);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Social registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col lg:flex-row w-full -m-8 relative select-none">
      
      {/* ===== LEFT COLUMN: AUTH FORM PANEL ===== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-20 py-12 relative">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm flex flex-col gap-6"
        >
          {/* Logo */}
          <div className="flex flex-col items-start lg:-ml-1">
            <Logo size="md" showText={true} />
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-2xl font-black text-white">Join BorrowIT</h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">Create an account to start sharing and borrowing today.</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-brand-primary text-center bg-brand-primary/10 py-2.5 rounded-xl border border-brand-primary/20 font-bold"
            >
              {error}
            </motion.div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Full Name Input */}
            <div className="flex flex-col gap-1.5">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Icons.User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#131314] border border-[#2A2A2D] focus:border-brand-primary rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Icons.Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131314] border border-[#2A2A2D] focus:border-brand-primary rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Icons.Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131314] border border-[#2A2A2D] focus:border-brand-primary rounded-xl py-3 pl-10 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white"
                  disabled={loading}
                >
                  {showPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions Text */}
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              By signing up, you agree to our <span className="text-white hover:underline cursor-pointer">Terms of Service</span> and neighborhood code of conduct.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary hover:bg-[#E05300] text-black font-extrabold py-3.5 rounded-xl text-xs transition-all duration-200 mt-2 shadow-lg shadow-brand-primary/10 select-none active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>

          {/* Social Sign-In Divider */}
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-[#2A2A2D]/60" />
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">or sign up with</span>
            <div className="flex-1 h-[1px] bg-[#2A2A2D]/60" />
          </div>

          {/* Social Icon Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
              className="w-11 h-11 rounded-full bg-[#131314] border border-[#2A2A2D] flex items-center justify-center text-white hover:bg-[#1A1A1C] transition-all active:scale-95 disabled:opacity-50"
              title="Sign up with Google"
            >
              <Icons.Chrome className="w-4 h-4 text-brand-primary" />
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              disabled={loading}
              className="w-11 h-11 rounded-full bg-[#131314] border border-[#2A2A2D] flex items-center justify-center text-white hover:bg-[#1A1A1C] transition-all active:scale-95 disabled:opacity-50"
              title="Sign up with Apple"
            >
              <Icons.Apple className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Sign In Redirect */}
          <p className="text-xs text-slate-500 mt-2 text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-primary hover:underline transition-all">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ===== RIGHT COLUMN: HERO ILLUSTRATION GRAPHIC ===== */}
      <div 
        className="w-full lg:w-1/2 hidden lg:flex flex-col justify-center items-center bg-[#070708] border-l border-[#2A2A2D]/35 p-12 relative overflow-hidden select-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 85% 15%, rgba(255, 94, 0, 0.04) 0%, transparent 45%),
            radial-gradient(circle at 15% 85%, rgba(255, 94, 0, 0.03) 0%, transparent 45%),
            radial-gradient(rgba(255, 94, 0, 0.01) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 24px 24px'
        }}
      >
        {/* Soft background shape decorative */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/5 rounded-full filter blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full flex flex-col items-center gap-8 z-10 text-center"
        >
          {/* Custom Breathing Vector Illustration Component */}
          <AuthAnimation />

          <div className="max-w-md flex flex-col gap-2 mt-4">
            <h3 className="text-xl font-black text-white">Share More. Buy Less.</h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              BorrowIT connects local neighbors to borrow and lend household gadgets, tools, and accessories securely. Reduce carbon footprint, save wallet cash, and raise your dynamic Trust Score.
            </p>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
