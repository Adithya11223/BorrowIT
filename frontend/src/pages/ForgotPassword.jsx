// ForgotPassword.jsx - Reset Password Form for BorrowIT

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockServices } from '../services/mockServices';
import { useApp } from '../context/AppContext';
import { Button, Input, Card } from '../components/UI';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const { addToast } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await mockServices.resetPassword(email);
      setSent(true);
      addToast('Reset Email Sent', 'Please check your inbox for instructions.', 'success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1C] px-4 relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md p-8 relative z-10" hoverable={false}>
        {!sent ? (
          <>
            <div className="text-center mb-6">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors mb-4 font-bold uppercase tracking-wider">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Login
              </Link>
              <h2 className="text-2xl font-black text-white">Reset Password</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Enter your registered email below, and we will send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                error={error}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2"
                loading={loading}
              >
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 flex flex-col items-center">
            <div className="bg-brand-primary/100/10 rounded-full p-4 mb-4 border border-brand-primary/20 text-brand-primary">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-white">Check Your Email</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-sm">
              We have sent a password reset link to <strong className="text-slate-300">{email}</strong>. Please check your inbox and spam folder.
            </p>
            
            <Link to="/login" className="mt-8 w-full">
              <Button variant="secondary" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
