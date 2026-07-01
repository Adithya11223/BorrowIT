// VerifyOtp.jsx - Premium Verification Code Page for BorrowIT
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Button } from '../components/UI';
import Logo from '../components/Logo';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useApp();
  
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Verification code timer cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(c => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Perform verification request
      await api.verifyOtp(email, otp);
      addToast('Account Verified', 'Your email has been verified. You can now log in!', 'success');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      setResending(true);
      setError('');
      const res = await api.resendOtp(email);
      if (res && res.verificationOtp) {
        addToast('Verification Code Resent', `SMTP not set up. Code: ${res.verificationOtp}`, 'success');
        setOtp(res.verificationOtp);
      } else {
        addToast('Code Resent', 'A new verification code has been dispatched.', 'success');
      }
      setCooldown(30); // 30s cooldown
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#1A1A1C] border border-[#2A2A2D] rounded-[24px] p-8 shadow-2xl relative select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col gap-6"
      >
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center text-center">
          <Logo size="md" showText={true} />
          <h2 className="text-xl font-black text-white mt-4">Verify Your Account</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium max-w-[280px]">
            We've sent a 6-digit code to <strong className="text-white font-semibold">{email}</strong>
          </p>
        </div>

        {/* Info Notification Alert for Testing */}
        <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-3 text-[10px] text-slate-300 flex items-start gap-2.5 font-medium leading-relaxed">
          <Icons.Info className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">Verification Tip:</span> If you haven't configured SMTP email, check the Render backend console logs to read your 6-digit OTP code.
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs text-brand-primary text-center bg-brand-primary/10 py-2.5 rounded-xl border border-brand-primary/20 font-bold"
          >
            {error}
          </motion.div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Icons.Key className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#131314] border border-[#2A2A2D] focus:border-brand-primary rounded-xl py-3 pl-10 pr-4 text-center tracking-[0.2em] font-mono text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="glow" className="py-3 w-full" loading={loading}>
            Verify Account
          </Button>
        </form>

        {/* Resend Cooldown Section */}
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2 border-t border-[#2A2A2D]/40 pt-4">
          <span>Didn't receive code?</span>
          <button
            type="button"
            disabled={cooldown > 0 || resending}
            onClick={handleResend}
            className={`text-brand-primary transition-all active:scale-95 ${
              cooldown > 0 || resending ? 'opacity-40 cursor-not-allowed' : 'hover:underline'
            }`}
          >
            {cooldown > 0 ? `Resend Code (${cooldown}s)` : resending ? 'Resending...' : 'Resend Code'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
