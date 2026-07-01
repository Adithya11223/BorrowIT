// About.jsx - Company vision, sustainability values, and creator attributes for BorrowIT

import React from 'react';
import { Card } from '../components/UI';
import { PackageCheck, Leaf, Heart, Users } from 'lucide-react';

export default function About() {
  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 25%, rgba(234, 88, 12, 0.08) 0%, transparent 55%),
          radial-gradient(circle at 85% 75%, rgba(251, 146, 60, 0.08) 0%, transparent 55%),
          radial-gradient(circle at 50% 10%, rgba(245, 158, 11, 0.05) 0%, transparent 40%),
          radial-gradient(rgba(255, 94, 0, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%, 20px 20px',
        backgroundColor: '#0D0D0E'
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-12">
      {/* Intro */}
      <div className="text-center">
        <div className="inline-flex p-3 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary mb-4">
          <PackageCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">About BorrowIT</h1>
        <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto leading-relaxed">
          BorrowIT is a circular-economy platform designed to connect people who own quality, low-usage items with neighbors who need them temporarily.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center flex flex-col items-center gap-4 bg-[#1A1A1C]" hoverable={false}>
          <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Sustainability</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Reduce consumer waste and the environmental impact of manufacturing by sharing tools, accessories, and gear instead of buying new.
          </p>
        </Card>

        <Card className="p-6 text-center flex flex-col items-center gap-4 bg-[#1A1A1C]" hoverable={false}>
          <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Community</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Strengthen local networks, meet friendly neighbors, and build high Trust Scores through secure, respectful interactions.
          </p>
        </Card>

        <Card className="p-6 text-center flex flex-col items-center gap-4 bg-[#1A1A1C]" hoverable={false}>
          <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Affordability</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Why spend full price on items you only use twice a year? Borrow them for a tiny daily rate, or offset listings costs by lending.
          </p>
        </Card>
      </div>

      {/* Creator card */}
      <Card className="p-6 md:p-8 bg-[#1A1A1C] flex flex-col md:flex-row justify-between items-center gap-6 border-[#2A2A2D]" hoverable={false} glow>
        <div className="flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">Platform Creator</span>
          <h3 className="text-xl font-black text-white mt-1">ANKUNCHE ADITHYA</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
            This project was designed and built as a frontend-first interactive application for neighborhood asset sharing, optimizing local resource usage and building localized circular economies.
          </p>
        </div>
        <div className="p-4 rounded-full bg-[#131314] border border-[#2A2A2D] text-slate-650">
          <PackageCheck className="w-12 h-12" />
        </div>
      </Card>
      </div>
    </div>
  );
}
