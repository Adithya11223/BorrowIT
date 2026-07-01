// Navbar.jsx - Glassmorphic top navigation bar for BorrowIT

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Avatar, Badge, Dropdown, Button } from './UI';
import Logo from './Logo';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { currentUser, notifications, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  
  const unreadNotifCount = notifications.filter(n => !n.read).length;
  
  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  const navLinks = [
    { label: 'Browse', path: '/browse' },
    { label: 'About Us', path: '/about' },
    { label: 'Help Center', path: '/help' },
    { label: 'Contact', path: '/contact' },
  ];

  const userDropdownOptions = [
    { label: 'Dashboard', icon: 'LayoutDashboard', onClick: () => navigate('/dashboard') },
    { label: 'My Listings', icon: 'FolderHeart', onClick: () => navigate('/my-items') },
    { label: 'Wishlist', icon: 'Heart', onClick: () => navigate('/wishlist') },
    { label: 'Settings', icon: 'Settings', onClick: () => navigate('/settings') },
    { label: 'Log Out', icon: 'LogOut', className: 'text-red-400 hover:text-red-300', onClick: logout }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-border bg-[#0D0D0E]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-8">
          <Link to="/">
            <Logo size="sm" showText={true} />
          </Link>
          
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold tracking-wide transition-colors ${
                    active ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center/Right: Actions */}
        <div className="flex items-center gap-4">
          
          {/* Quick Search (Desktop) */}
          {currentUser && (
            <form onSubmit={handleQuickSearch} className="hidden lg:flex relative w-60">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Quick search..."
                className="w-full bg-dark-input border border-[#2A2A2D] focus:border-brand-primary focus:ring-1 focus:ring-brand-primary rounded-xl py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none transition-all duration-200"
              />
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            </form>
          )}

          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Message Icon Link */}
              <Link 
                to="/messages"
                className="relative text-slate-500 hover:text-white p-2 rounded-xl hover:bg-[#131314] transition-colors"
                title="Messages"
              >
                <Icons.MessageCircle className="w-5 h-5" />
              </Link>

              {/* Notification Icon Link */}
              <Link 
                to="/notifications"
                className="relative text-slate-500 hover:text-white p-2 rounded-xl hover:bg-[#131314] transition-colors"
                title="Notifications"
              >
                <Icons.Bell className="w-5 h-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-primary border-2 border-dark-bg rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                    {unreadNotifCount}
                  </span>
                )}
              </Link>

              {/* User Menu Dropdown */}
              <Dropdown
                trigger={
                  <div className="cursor-pointer flex items-center gap-2 p-1 pl-1 pr-2 hover:bg-[#131314] rounded-full transition-colors border border-transparent hover:border-[#2A2A2D]">
                    <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" verified={currentUser.verified.identity} />
                    <span className="hidden sm:inline text-xs font-semibold text-slate-300 hover:text-white select-none max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                    <Icons.ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
                  </div>
                }
                options={userDropdownOptions}
              />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="glow" size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-500 hover:text-white p-1 rounded-lg focus:outline-none"
          >
            {mobileMenuOpen ? <Icons.X className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#2A2A2D] bg-[#0D0D0E] overflow-hidden px-4 py-4 flex flex-col gap-4"
          >
            {/* Search Input for Mobile */}
            {currentUser && (
              <form onSubmit={handleQuickSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search listings..."
                  className="w-full bg-dark-input border border-[#2A2A2D] rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none"
                />
                <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              </form>
            )}

            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-slate-400 hover:text-white py-1 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {!currentUser && (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#2A2A2D]">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Log In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="glow" size="sm" className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
