// App.jsx - Main router, responsive page layout, and global navigation for BorrowIT

import React from 'react';
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/UI';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import * as Icons from 'lucide-react';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import Browse from './pages/Browse';
import ItemDetails from './pages/ItemDetails';
import Dashboard from './pages/Dashboard';
import MyItems from './pages/MyItems';
import AddItem from './pages/AddItem';
import BorrowRequests from './pages/BorrowRequests';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Wishlist from './pages/Wishlist';
import Settings from './pages/Settings';
import Help from './pages/Help';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

function MainAppContent() {
  const { currentUser, toasts, removeToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if auth route (no status/nav bars)
  const isAuthRoute = ['/login', '/register', '/forgot-password', '/verify-otp'].includes(location.pathname);
  
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-4 select-none">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
        </Routes>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#000000] text-white font-sans select-none pb-[56px] md:pb-0">
      {/* Global Desktop/Tablet Navbar */}
      <Navbar />

      {/* Main Responsive Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-items" element={<MyItems />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/edit-item/:id" element={<AddItem />} />
          <Route path="/requests" element={<BorrowRequests />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Desktop/Tablet Footer */}
      <Footer />

      {/* Mobile Tab Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[56px] border-t border-[#2A2A2D]/40 bg-black/90 backdrop-blur-md flex items-center justify-around shrink-0 px-2 pb-1 z-30">
        <Link to="/" className={`flex flex-col items-center justify-center ${location.pathname === '/' ? 'text-brand-primary' : 'text-slate-400 hover:text-white'}`}>
          <Icons.Home className="w-4.5 h-4.5" />
          <span className="text-[8px] font-bold mt-1">Home</span>
        </Link>
        <Link to="/browse" className={`flex flex-col items-center justify-center ${location.pathname === '/browse' ? 'text-brand-primary' : 'text-slate-400 hover:text-white'}`}>
          <Icons.Search className="w-4.5 h-4.5" />
          <span className="text-[8px] font-bold mt-1">Search</span>
        </Link>
        
        {/* Floating Plus */}
        <Link to="/add-item" className="relative -top-3">
          <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-black shadow-lg shadow-brand-primary/25 active:scale-95 transition-all">
            <Icons.Plus className="w-5 h-5 stroke-[3]" />
          </div>
        </Link>

        <Link to="/requests" className={`flex flex-col items-center justify-center ${location.pathname === '/requests' ? 'text-brand-primary' : 'text-slate-400 hover:text-white'}`}>
          <Icons.Inbox className="w-4.5 h-4.5" />
          <span className="text-[8px] font-bold mt-1">Requests</span>
        </Link>
        <Link to="/dashboard" className={`flex flex-col items-center justify-center ${location.pathname === '/dashboard' ? 'text-brand-primary' : 'text-slate-400 hover:text-white'}`}>
          <Icons.User className="w-4.5 h-4.5" />
          <span className="text-[8px] font-bold mt-1">Profile</span>
        </Link>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
