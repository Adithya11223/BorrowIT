// ItemDetails.jsx - Desktop split responsive item detail layout for BorrowIT

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Card, Badge } from '../components/UI';
import * as Icons from 'lucide-react';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, currentUser, sendBorrowRequest, toggleWishlist, wishlist } = useApp();
  const [requestLoading, setRequestLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Find item by ID or default to first
  const item = items.find(i => i.id === id) || items[0];

  // Calculate total days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      if (end >= start) {
        setTotalDays(diffDays);
      } else {
        setTotalDays(0);
      }
    }
  }, [startDate, endDate]);

  if (!item) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
        <Icons.AlertTriangle className="w-10 h-10 text-brand-primary mb-3" />
        <h3 className="text-sm font-bold text-white">Item Not Found</h3>
        <Link to="/browse" className="text-xs text-brand-primary hover:underline mt-2">Back to Catalog</Link>
      </div>
    );
  }

  const isWish = wishlist.some(w => w.id === item.id);
  const estimatedPrice = totalDays * item.price;
  const isOwner = currentUser && currentUser.id === item.ownerId;

  const handleSendRequest = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (totalDays <= 0) return;
    try {
      setRequestLoading(true);
      await sendBorrowRequest(item.id, startDate, endDate, estimatedPrice);
      navigate('/requests');
    } catch (err) {
      console.error(err);
    } finally {
      setRequestLoading(false);
    }
  };

  const startChat = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate(`/messages?chat=${item.ownerId}`);
  };

  return (
    <div className="bg-[#000000] min-h-full text-white flex flex-col gap-8 select-none">
      
      {/* Back link and navigation */}
      <div className="flex justify-between items-center pb-2 border-b border-[#2A2A2D]/30">
        <Link to="/browse" className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold">
          <Icons.ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Item ID: {item.id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image + Specs */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#FFFFFF] border border-[#2A2A2D]/20 rounded-[28px] p-6 flex flex-col items-center justify-center aspect-[1.3] relative shadow-lg group">
            <img src={item.images[activeImgIdx] || item.images[0]} alt={item.title} className="w-full h-full object-contain select-none" />
            
            {/* Wishlist toggle absolute */}
            <button
              type="button"
              onClick={() => toggleWishlist(item)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 border border-[#2A2A2D] flex items-center justify-center text-brand-primary transition-all active:scale-90 z-10"
            >
              <Icons.Heart className={`w-5 h-5 ${isWish ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
            </button>

            {/* Gallery navigation controls */}
            {item.images && item.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImgIdx(prev => Math.max(0, prev - 1))}
                  disabled={activeImgIdx === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white disabled:opacity-0 transition-opacity"
                >
                  <Icons.ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImgIdx(prev => Math.min(item.images.length - 1, prev + 1))}
                  disabled={activeImgIdx === item.images.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white disabled:opacity-0 transition-opacity"
                >
                  <Icons.ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Gallery Indicator dots */}
            {item.images && item.images.length > 1 && (
              <div className="flex gap-1.5 mt-3 absolute bottom-4">
                {item.images.map((_, idx) => (
                  <span 
                    key={idx} 
                    onClick={() => setActiveImgIdx(idx)}
                    className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${idx === activeImgIdx ? 'bg-brand-primary w-3' : 'bg-slate-400'}`} 
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">About this item</h4>
            <p className="text-sm text-slate-400 leading-relaxed font-semibold">
              {item.description}
            </p>
          </div>

          {/* Specifications */}
          {item.specifications && (
            <div className="flex flex-col gap-3 border-t border-[#2A2A2D]/40 pt-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Specifications</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(item.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center bg-[#131314]/85 border border-[#2A2A2D] p-3 rounded-xl text-xs font-sans">
                    <span className="text-slate-500 capitalize font-medium">{key}</span>
                    <span className="text-white font-bold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety instructions */}
          {item.safetyTips && (
            <div className="flex flex-col gap-3 border-t border-[#2A2A2D]/40 pt-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Safety & Usage Tips</h4>
              <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1.5 font-medium leading-relaxed">
                {item.safetyTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Reservation / Contact */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white">{item.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-lg font-black text-brand-primary">₹{item.price} <span className="text-xs text-slate-500 font-normal">/ day</span></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2A2A2D]" />
              <span className="flex items-center gap-1 text-xs font-bold text-brand-primary bg-[#131314] border border-[#2A2A2D]/60 px-2 py-0.5 rounded-lg">
                <Icons.Star className="w-3.5 h-3.5 fill-brand-primary text-brand-primary" />
                {item.rating?.toFixed(1)} <span className="text-slate-500 font-semibold">({item.reviewsCount || 0} reviews)</span>
              </span>
            </div>
          </div>

          {/* Availability and Security Deposit badge */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-extrabold ${item.available ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {item.available ? '● Available to Borrow' : '● Currently Reserved'}
            </span>
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-extrabold ${item.deposit ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
              {item.deposit ? `Security Deposit: ₹${item.deposit}` : 'No Security Deposit Required'}
            </span>
          </div>

          {/* Scheduler panel */}
          {!isOwner ? (
            <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Reserve this item</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">From Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#131314] border border-[#2A2A2D] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-primary font-sans"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">To Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#131314] border border-[#2A2A2D] rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-primary font-sans"
                  />
                </div>
              </div>

              {totalDays > 0 && (
                <div className="flex flex-col gap-2 mt-2 border-t border-[#2A2A2D]/55 pt-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                    <span>Daily rate:</span>
                    <span>₹{item.price} x {totalDays} days</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black text-white">
                    <span>Estimated Total:</span>
                    <span className="text-brand-primary text-base">₹{estimatedPrice}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2.5 mt-3">
                <button
                  onClick={handleSendRequest}
                  disabled={totalDays <= 0 || requestLoading || !item.available}
                  className="w-full bg-brand-primary hover:bg-[#E05300] text-black font-extrabold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 select-none active:scale-95 disabled:opacity-50"
                >
                  <Icons.Send className="w-4 h-4" />
                  {requestLoading ? 'Sending Request...' : !item.available ? 'Currently Unavailable' : 'Request to Borrow'}
                </button>
                
                <button
                  onClick={startChat}
                  className="w-full bg-transparent border border-brand-primary text-white hover:bg-brand-primary hover:text-black font-extrabold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 select-none active:scale-95"
                >
                  <Icons.MessageSquare className="w-4 h-4" />
                  Chat with Owner
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#1A1A1C] border border-brand-primary/20 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3">
              <div className="p-3 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/15">
                <Icons.Lock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Your Listing</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">You listed this item in the community network. You can manage or delete this item from your dashboard.</p>
              </div>
              <Link to="/my-items" className="w-full mt-2">
                <Button variant="secondary" size="sm" className="w-full text-xs font-bold py-2.5">Manage Listing</Button>
              </Link>
            </div>
          )}

          {/* Owner details block */}
          {item.owner && (
            <Link to={`/profile/${item.ownerId}`} className="flex items-center justify-between bg-[#1A1A1C] border border-[#2A2A2D] rounded-2xl p-4 cursor-pointer hover:bg-[#202022] transition-colors border-l-4 border-l-brand-primary">
              <div className="flex items-center gap-3">
                <img src={item.owner.avatar} alt={item.owner.name} className="w-10 h-10 rounded-full object-cover border border-[#2A2A2D]" />
                <div>
                  <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Listed by</p>
                  <p className="text-xs font-black text-white">{item.owner.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5 font-sans">
                    <Icons.MapPin className="w-3.5 h-3.5 text-brand-primary" />
                    {item.distance} ({item.location?.split(',')[0]})
                  </p>
                </div>
              </div>
              <Icons.ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}
