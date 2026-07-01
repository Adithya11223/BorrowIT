// Contact.jsx - Contact form & support coordinates for BorrowIT

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Input } from '../components/UI';
import * as Icons from 'lucide-react';

export default function Contact() {
  const { addToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      addToast('Message Sent', 'Our support team will get back to you shortly.', 'success');
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-white">Contact Us</h1>
        <p className="text-sm text-slate-500 mt-2">Have a question or feedback? Write to our customer support desk.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact form */}
        <div className="md:col-span-7">
          <Card className="p-6 bg-[#1A1A1C] border-slate-205" hoverable={false}>
            {!sent ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon="User"
                  required
                />
                
                <Input
                  label="Email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon="Mail"
                  required
                />

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold text-slate-550 uppercase tracking-wide">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Describe your query in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#131314] border border-[#2A2A2D] rounded-xl py-2 px-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-sans resize-none"
                    required
                  />
                </div>

                <Button type="submit" variant="glow" className="mt-2 w-full" loading={loading}>
                  Send Message
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="bg-brand-primary/10 text-brand-primary rounded-full p-4 mb-4 border border-brand-primary/20 inline-block">
                  <Icons.CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-white">Thank You!</h3>
                <p className="text-xs text-slate-500 mt-2">Your support query has been logged. We'll reply within 24 hours.</p>
                <Button variant="secondary" className="mt-6 text-xs" onClick={() => setSent(false)}>Send Another Message</Button>
              </div>
            )}
          </Card>
        </div>

        {/* Support coordinates */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <Card className="p-5 bg-[#1A1A1C] border-slate-205 flex items-start gap-4" hoverable={false}>
            <div className="p-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
              <Icons.Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Email Address</h4>
              <p className="text-xs text-brand-primary font-bold mt-1">adithya7075547800@gmail.com</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Replies within 24 hours</p>
            </div>
          </Card>

          <Card className="p-5 bg-[#1A1A1C] border-slate-205 flex items-start gap-4" hoverable={false}>
            <div className="p-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
              <Icons.Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Phone Support</h4>
              <p className="text-xs text-brand-primary font-bold mt-1">7075547800</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Available 24/7</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
