// Help.jsx - FAQ & Support guidelines page for BorrowIT

import React, { useState } from 'react';
import { faqs } from '../services/mockData';
import { Card, Button } from '../components/UI';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Help() {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `
          radial-gradient(circle at 80% 15%, rgba(234, 88, 12, 0.07) 0%, transparent 50%),
          radial-gradient(circle at 20% 85%, rgba(249, 115, 22, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(194, 65, 12, 0.04) 0%, transparent 40%),
          radial-gradient(rgba(255, 94, 0, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 18px 18px',
        backgroundColor: '#0D0D0E'
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-white">Help Center & FAQ</h1>
        <p className="text-sm text-slate-400 mt-2">Find quick answers, learn safety tips, or reach our support specialists.</p>
      </div>

      {/* Grid boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-5 text-center flex flex-col items-center justify-between bg-[#1A1A1C] border-[#2A2A2D]" hoverable>
          <div className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
            <Icons.BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mt-4">Guides & Manuals</h4>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-normal font-medium">Learn community safety best practices and pickup protocols.</p>
          <Button variant="ghost" size="sm" className="mt-4 text-xs">Read Guides</Button>
        </Card>

        <Card className="p-5 text-center flex flex-col items-center justify-between bg-[#1A1A1C] border-[#2A2A2D]" hoverable>
          <div className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
            <Icons.PhoneCall className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mt-4">Direct Support</h4>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-normal font-medium">Having trouble with deposits or returns? Contact our team.</p>
          <Link to="/contact" className="mt-4 w-full">
            <Button variant="secondary" size="sm" className="w-full text-xs">Get Help</Button>
          </Link>
        </Card>

        <Card className="p-5 text-center flex flex-col items-center justify-between bg-[#1A1A1C] border-[#2A2A2D]" hoverable>
          <div className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
            <Icons.ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white mt-4">Safety Assurance</h4>
          <p className="text-[11px] text-slate-400 mt-1.5 leading-normal font-medium">Learn about BorrowIT community security and ratings system.</p>
          <Button variant="ghost" size="sm" className="mt-4 text-xs">Safety Specs</Button>
        </Card>
      </div>

      {/* Accordion list */}
      <h3 className="text-lg font-black text-white mb-6">Frequently Asked Questions</h3>
      <div className="flex flex-col gap-4">
        {faqs.map((faq, idx) => {
          const active = activeFaq === idx;
          return (
            <div key={idx} className="rounded-xl border border-[#2A2A2D] bg-[#1A1A1C] overflow-hidden">
              <button
                onClick={() => setActiveFaq(active ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-slate-300 hover:text-slate-950 focus:outline-none"
              >
                <span>{faq.q}</span>
                <Icons.ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${active ? 'rotate-180 text-brand-primary' : ''}`} />
              </button>
              {active && (
                <div className="px-5 pb-5 text-xs text-slate-550 leading-relaxed border-t border-[#2A2A2D] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
