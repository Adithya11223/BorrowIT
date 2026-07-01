// Dashboard.jsx - User statistics & upcoming activity stream for BorrowIT

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge } from '../components/UI';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { currentUser, requests, notifications, handleRequestStatus } = useApp();
  const navigate = useNavigate();

  // Filter requests that are currently active (borrowing)
  const activeBorrows = requests.filter(r => r.borrowerId === currentUser?.id && r.status === 'Accepted');
  const activeLends = requests.filter(r => r.ownerId === currentUser?.id && r.status === 'Accepted');

  // Statistics values
  const stats = [
    { label: 'Borrowing Items', val: activeBorrows.length, icon: 'ArrowDownLeft', color: 'text-brand-primary', bg: 'bg-brand-primary/100/10 border-brand-primary/20' },
    { label: 'Lending Items', val: activeLends.length, icon: 'ArrowUpRight', color: 'text-brand-primary', bg: 'bg-brand-primary/100/10 border-brand-primary/20' },
    { label: 'Active Requests', val: requests.filter(r => r.status === 'Pending').length, icon: 'Clock', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'Trust Rating', val: currentUser?.trustScore || 5.0, icon: 'ShieldCheck', color: 'text-brand-primary', bg: 'bg-brand-primary/100/10 border-brand-primary/20', isRating: true }
  ];

  // Activities feed
  const activities = notifications.slice(0, 3);

  // Upcoming returns check (borrowing items ending soon)
  const upcomingReturns = requests.filter(r => 
    r.borrowerId === currentUser?.id && 
    r.status === 'Accepted'
  );

  const handleReturnItem = async (reqId) => {
    try {
      await handleRequestStatus(reqId, 'Returned');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Welcome back, {currentUser?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here is what is happening with your account today.</p>
        </div>
        
        <Link to="/add-item">
          <Button variant="glow" icon="Plus" size="sm">
            Add New Item
          </Button>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = Icons[stat.icon] || Icons.Folder;
          return (
            <Card key={idx} className="p-5 bg-[#1A1A1C] border-[#2A2A2D] shadow-sm flex items-center justify-between" hoverable={false}>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-500 tracking-wide">{stat.label}</span>
                <span className="text-2xl font-black text-white flex items-baseline gap-1">
                  {stat.val}
                  {stat.isRating && <span className="text-xs text-slate-500 font-normal">/ 5.0</span>}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl border ${stat.bg} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Double Column: Activity & Returns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Activity Feed (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent Activity</h3>
          <Card className="p-5 bg-[#1A1A1C] border-[#2A2A2D] shadow-sm flex flex-col gap-4" hoverable={false}>
            {activities.length > 0 ? (
              <div className="flex flex-col gap-4">
                {activities.map((act) => {
                  const icons = {
                    lend: 'ArrowUpRight',
                    borrow: 'ArrowDownLeft',
                    system: 'Bell'
                  };
                  const colors = {
                    lend: 'text-orange-400 border-orange-500/10 bg-orange-500/5',
                    borrow: 'text-brand-primary border-brand-primary/10 bg-brand-primary/5',
                    system: 'text-brand-primary border-brand-primary/10 bg-brand-primary/5'
                  };
                  const Icon = Icons[icons[act.type] || 'Bell'];

                  return (
                    <div key={act.id} className="flex gap-4 items-start p-3 rounded-xl border border-[#2A2A2D] bg-[#131314]/50">
                      <div className={`p-2 rounded-lg border ${colors[act.type]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-white">{act.title}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{act.message}</p>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-1.5">{act.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 font-semibold">
                No recent activity logs.
              </div>
            )}
            
            <Link to="/notifications">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View All Notifications
              </Button>
            </Link>
          </Card>
        </div>

        {/* Right Column: Upcoming Returns Widget (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Upcoming Returns</h3>
          <Card className="p-5 bg-[#1A1A1C] border-[#2A2A2D] shadow-sm flex flex-col gap-4" hoverable={false}>
            {upcomingReturns.length > 0 ? (
              <div className="flex flex-col gap-4">
                {upcomingReturns.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3.5 rounded-xl border border-[#2A2A2D] bg-[#131314]/50 gap-4">
                    <div className="flex items-center gap-3">
                      <img src={req.itemImage || req.item?.images[0]} alt={req.itemName} className="w-10 h-10 rounded-lg object-cover border border-[#2A2A2D]" />
                      <div>
                        <h4 className="text-xs font-extrabold text-white line-clamp-1">{req.itemName}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Due: {req.endDate}</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10 whitespace-nowrap"
                      onClick={() => handleReturnItem(req.id)}
                    >
                      Return Item
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 flex flex-col items-center justify-center">
                <Icons.CheckCircle className="w-8 h-8 text-brand-primary mb-3" />
                <p className="text-xs font-bold text-white">All caught up!</p>
                <p className="text-[10px] text-slate-500 mt-1">You have no pending returns due.</p>
              </div>
            )}
          </Card>
        </div>

      </div>

    </div>
  );
}
