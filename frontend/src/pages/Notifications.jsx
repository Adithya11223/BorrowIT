// Notifications.jsx - Full-screen notification center for BorrowIT

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button, Card, Badge, EmptyState } from '../components/UI';
import * as Icons from 'lucide-react';

export default function Notifications() {
  const { notifications, markAllNotificationsAsRead, clearAllNotifications } = useApp();
  const [filter, setFilter] = useState('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'borrow') return n.type === 'borrow';
    if (filter === 'lend') return n.type === 'lend';
    return true;
  });

  const getNotifDetails = (type) => {
    switch (type) {
      case 'borrow':
        return { icon: 'ArrowDownLeft', color: 'text-brand-primary border-brand-primary/15 bg-brand-primary/100/5' };
      case 'lend':
        return { icon: 'ArrowUpRight', color: 'text-brand-primary border-brand-primary/15 bg-brand-primary/100/5' };
      default:
        return { icon: 'Bell', color: 'text-brand-primary border-brand-primary/15 bg-brand-primary/5' };
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header with control actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Notifications</h1>
          <p className="text-sm text-slate-500 mt-1">Stay updated with your borrowing and lending activities.</p>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-xs" icon="Check" onClick={markAllNotificationsAsRead}>
              Mark all read
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-red-400 hover:text-red-300" icon="Trash" onClick={clearAllNotifications}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Tabs / Filters */}
      <div className="flex border-b border-[#2A2A2D] gap-4 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'all', label: 'All Activities' },
          { id: 'unread', label: 'Unread' },
          { id: 'borrow', label: 'Borrows' },
          { id: 'lend', label: 'Lends' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap relative ${
              filter === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.label}
            {filter === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Streams list */}
      {filteredNotifs.length > 0 ? (
        <Card className="p-0 overflow-hidden bg-[#1A1A1C] border-[#2A2A2D]/60 shadow-sm border border-[#2A2A2D]" hoverable={false}>
          <div className="flex flex-col divide-y divide-slate-200">
            {filteredNotifs.map((notif) => {
              const { icon, color } = getNotifDetails(notif.type);
              const IconComponent = Icons[icon] || Icons.Bell;

              return (
                <div 
                  key={notif.id} 
                  className={`flex gap-4 p-5 items-start transition-colors hover:bg-slate-800/10 ${
                    !notif.read ? 'bg-brand-primary/[0.02] border-l-2 border-brand-primary' : ''
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border ${color} shrink-0`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className={`text-sm font-bold ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-primary mt-1.5" />
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">{notif.message}</p>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-2">{notif.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <EmptyState
          icon="BellOff"
          title="All caught up!"
          description="You have no notifications matching the selected filter."
        />
      )}

    </div>
  );
}
