// Home.jsx - Full-bleed responsive landing page for BorrowIT

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, Button, Avatar, Rating } from '../components/UI';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { items, wishlist, toggleWishlist } = useApp();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const categories = [
    { name: 'Electronics', icon: Icons.Headphones, id: 'Electronics' },
    { name: 'Tools', icon: Icons.Wrench, id: 'Tools' },
    { name: 'Sports & Outdoors', icon: Icons.Activity, id: 'Sports' },
    { name: 'Books', icon: Icons.BookOpen, id: 'Books' },
    { name: 'Home Appliances', icon: Icons.Armchair, id: 'Home' },
    { name: 'Cameras & Photo', icon: Icons.Camera, id: 'Cameras' }
  ];

  const faqs = [
    { q: "How does borrowing work on BorrowIT?", a: "Browse items in your area, select your desired rental dates, and submit a request. Once approved by the owner, coordinate exchange details via secure chat." },
    { q: "Is there a safety deposit required?", a: "Owners can choose to request a refundable safety deposit. Terms are outlined in each item's individual listings." },
    { q: "What happens if an item gets damaged?", a: "All transactions are backed by our Community Trust Guidelines. We recommend taking photos during pickup. In case of accidental damage, coordinate directly with the owner to resolve." },
    { q: "How is the Trust Score calculated?", a: "Your Trust Score increases automatically when you return items on time, receive positive ratings, and complete profile verifications (email, phone, identity check)." }
  ];

  const handleToggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="flex flex-col gap-20 -mt-8 relative overflow-hidden select-none">
      
      {/* Decorative Grid Mesh Background */}
      <div className="absolute inset-0 bg-[#000000] -z-10" style={{
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(255, 94, 0, 0.07) 0%, transparent 45%),
          radial-gradient(circle at 90% 80%, rgba(255, 122, 0, 0.06) 0%, transparent 45%),
          radial-gradient(rgba(255, 94, 0, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 20px 20px'
      }} />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-16 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-bold text-brand-primary">
            <Icons.Sparkles className="w-3.5 h-3.5" />
            <span>Circular Economy Neighborhood App</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight max-w-4xl">
            Why buy when you can <span className="text-brand-primary drop-shadow-[0_0_15px_rgba(255,94,0,0.15)]">Borrow</span>?
          </h1>

          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl leading-relaxed mt-2 font-medium">
            Save money, declutter your space, and help the planet by borrowing tools, cameras, camping equipment, and gadgets from trusted neighbors nearby.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
            <Link to="/browse">
              <Button variant="glow" size="md" className="w-full sm:w-auto px-8 py-3.5 text-sm font-extrabold flex items-center justify-center gap-2">
                Explore Items
                <Icons.ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/add-item">
              <Button variant="outline" size="md" className="w-full sm:w-auto px-8 py-3.5 text-sm font-extrabold border-[#2A2A2D] text-white hover:bg-[#131314]">
                List an Item
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Floating background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-primary/5 rounded-full filter blur-[80px] pointer-events-none -z-20" />
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section className="flex flex-col gap-6 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-brand-primary">Browse Categories</h2>
            <p className="text-xl font-bold text-white mt-1">What do you need today?</p>
          </div>
          <Link to="/browse" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
            View catalog <Icons.ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03, borderColor: '#FF5E00' }}
                className="cursor-pointer bg-[#1A1A1C] border border-[#2A2A2D] rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 transition-colors"
                onClick={() => navigate(`/browse?category=${cat.id}`)}
              >
                <div className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/15 text-brand-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-white mt-1 tracking-tight">{cat.name}</span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --- TRENDING ITEMS SECTION --- */}
      <section className="flex flex-col gap-6 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-brand-primary">Trending Near You</h2>
            <p className="text-xl font-bold text-white mt-1">Popular neighborhood shares</p>
          </div>
          <Link to="/browse" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
            See all listings <Icons.ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 4).map((item) => {
            const isWish = wishlist.some(w => w.id === item.id);
            return (
              <Card
                key={item.id}
                className="flex flex-col bg-[#1A1A1C] border-[#2A2A2D] p-3 rounded-2xl relative group overflow-hidden"
              >
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black border border-[#2A2A2D]/40">
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Location badge overlay */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-[#2A2A2D]/50 text-[9px] font-bold text-slate-300 flex items-center gap-1">
                    <Icons.MapPin className="w-3 h-3 text-brand-primary" />
                    {item.distance}
                  </div>

                  {/* Wishlist Icon */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(item);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-[#2A2A2D]/50 flex items-center justify-center text-brand-primary transition-all active:scale-90"
                  >
                    <Icons.Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                  </button>

                  {/* Owner overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <img src={item.owner?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80'} alt={item.owner?.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-[9px] text-white font-extrabold">{item.owner?.name}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold">{item.location?.split(',')[0]}</span>
                  </div>
                </div>

                <div className="mt-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-white line-clamp-1 group-hover:text-brand-primary transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-medium">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3.5 border-t border-[#2A2A2D]/40 pt-2">
                    <span className="text-xs font-black text-brand-primary">₹{item.price} <span className="text-[8px] text-slate-500 font-normal">/ day</span></span>
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-white bg-[#131314]/80 px-1.5 py-0.5 rounded border border-[#2A2A2D]/40">
                      <Icons.Star className="w-3 h-3 fill-brand-primary text-brand-primary" />
                      {item.rating?.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Cover Link */}
                <Link to={`/item/${item.id}`} className="absolute inset-0 opacity-0 z-0">
                  View details
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      {/* --- TRUST & COMMUNITY STATS SECTION --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 bg-[#1A1A1C] border border-[#2A2A2D] rounded-[24px] p-8 max-w-6xl mx-auto w-full relative overflow-hidden">
        {/* Glow vector overlay */}
        <div className="absolute right-0 bottom-0 w-[180px] h-[180px] bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col justify-center gap-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-brand-primary">Community Trust & Safety</h2>
          <h3 className="text-2xl font-black text-white">Lend with peace of mind. Borrow with confidence.</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            BorrowIT builds security and respect right into the platform. With digital verification checks, neighborhood-based reviews, and real-time Trust Score adjustments, you are sharing items within a vetted, cooperative local network.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-2">
            {[
              { title: 'Verified Identity', desc: 'Secure phone, email, and ID badge confirmations.', icon: Icons.UserCheck },
              { title: 'Community Rating', desc: 'Trust Scores are generated dynamically.', icon: Icons.ShieldCheck }
            ].map((prop, idx) => (
              <div key={idx} className="flex gap-2.5 items-start p-3 bg-[#131314] rounded-xl border border-[#2A2A2D]/80">
                <div className="p-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/15 text-brand-primary mt-0.5">
                  <prop.icon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[10px] font-bold text-white">{prop.title}</h5>
                  <p className="text-[8.5px] text-slate-500 mt-0.5 leading-normal font-semibold">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center">
          {[
            { label: 'Trusted Community', val: '10k+', desc: 'Active local members.' },
            { label: 'Successful Swaps', val: '45k+', desc: 'Shared circular tools.' },
            { label: 'Avg Trust Score', val: '4.9★', desc: 'Highest verified rating.' },
            { label: 'Money Saved', val: '₹12L+', desc: 'Kept in community pockets.' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#131314] p-5 rounded-2xl border border-[#2A2A2D] text-center flex flex-col gap-1">
              <span className="text-2xl font-black text-white">{stat.val}</span>
              <span className="text-[10px] font-bold text-brand-primary">{stat.label}</span>
              <span className="text-[8px] text-slate-500 font-semibold mt-0.5">{stat.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS CARDS --- */}
      <section className="flex flex-col gap-10 px-4 text-center items-center">
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-brand-primary">How It Works</h2>
          <h3 className="text-xl font-bold text-white mt-1">Four simple steps to borrow smarter</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl w-full">
          {[
            { step: '01', title: 'Find & Filter', desc: 'Browse local gadgets and select listings matching your date requirements.', icon: Icons.Search },
            { step: '02', title: 'Request Date', desc: 'Send booking dates directly to the owner. Estimated pricing calculates instantly.', icon: Icons.CalendarRange },
            { step: '03', title: 'Collect & Swap', desc: 'Accept terms, verify item, chat securely, and pick up from your neighbor.', icon: Icons.RefreshCw },
            { step: '04', title: 'Return Safe', desc: 'Hand the item back on schedule, update your logs, and leave mutual feedback.', icon: Icons.ShieldAlert }
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center bg-[#1A1A1C] border border-[#2A2A2D] p-6 rounded-2xl relative text-center">
              <span className="absolute top-3 left-4 text-2xl font-black text-[#2A2A2D] select-none">{step.step}</span>
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mb-4 mt-2">
                <step.icon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{step.title}</h4>
              <p className="text-[9.5px] text-slate-400 mt-2 leading-relaxed font-semibold max-w-[190px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="max-w-3xl mx-auto w-full px-4 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-xs font-black uppercase tracking-wider text-brand-primary">Support Desk</h2>
          <h3 className="text-xl font-bold text-white mt-1">Frequently Asked Questions</h3>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const active = activeFaq === idx;
            return (
              <div key={idx} className="border border-[#2A2A2D] bg-[#1A1A1C] rounded-xl overflow-hidden">
                <button
                  onClick={() => handleToggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-white text-xs hover:bg-[#202022] transition-colors"
                >
                  <span>{faq.q}</span>
                  <Icons.ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${active ? 'rotate-180 text-brand-primary' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-[#2A2A2D]/60 text-[10px] text-slate-400 leading-relaxed font-semibold font-sans bg-[#131314]/30">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
