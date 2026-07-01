// Sidebar.jsx - Shared Dashboard Sidebar Menu for BorrowIT (Light Theme)

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import * as Icons from 'lucide-react';

export default function Sidebar() {
  const { notifications, logout } = useApp();
  const navigate = useNavigate();
  
  const unreadNotifs = notifications.filter(n => !n.read).length;
  // Mock constant chat unread for dashboard sidebar
  const mockUnreadMessages = 1;

  const menuItems = [
    { label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
    { label: 'Browse Items', icon: 'Search', path: '/browse' },
    { label: 'My Items', icon: 'FolderHeart', path: '/my-items' },
    { label: 'Borrow Requests', icon: 'ArrowDownLeft', path: '/requests' },
    { label: 'Messages', icon: 'MessageSquare', path: '/messages', badge: mockUnreadMessages },
    { label: 'Notifications', icon: 'Bell', path: '/notifications', badge: unreadNotifs },
    { label: 'Wishlist', icon: 'Heart', path: '/wishlist' },
    { label: 'Settings', icon: 'Settings', path: '/settings' }
  ];

  return (
    <aside className="w-full md:w-64 glass border border-[#2A2A2D] rounded-2xl p-4 flex flex-col gap-1.5 h-fit shrink-0">
      <div className="px-3 py-2.5 mb-2 hidden md:block">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Navigation</p>
      </div>

      <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
        {menuItems.map((item) => {
          const Icon = Icons[item.icon] || Icons.Folder;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/20 shadow-sm'
                    : 'text-slate-500 hover:text-white hover:bg-dark-lighter border border-transparent'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className="bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide whitespace-nowrap text-red-400 hover:text-red-350 hover:bg-red-500/10 transition-all duration-200 border border-transparent mt-auto"
        >
          <Icons.LogOut className="w-4 h-4" />
          <span className="hidden md:inline text-left flex-1">Logout</span>
        </button>
      </nav>
    </aside>
  );
}
