import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#04060B] border-t border-slate-900 text-slate-500 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/">
              <Logo size="sm" showText={true} />
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-slate-500">
              Your trusted local borrowing and lending community platform. Share gadgets, tools, cameras, and sports items with neighbors you trust. Save money, reduce waste, and build community bonds.
            </p>
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <span>Creator:</span>
              <span className="text-white hover:text-brand-primary transition-colors cursor-pointer flex items-center gap-0.5">
                ANKUNCHE ADITHYA <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
          
          {/* Quick Grids */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Browse</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><Link to="/browse" className="hover:text-white transition-colors">All Listings</Link></li>
                  <li><Link to="/browse?category=electronics" className="hover:text-white transition-colors">Electronics</Link></li>
                  <li><Link to="/browse?category=cameras" className="hover:text-white transition-colors">Cameras</Link></li>
                  <li><Link to="/browse?category=sports" className="hover:text-white transition-colors">Sports & Outdoors</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Company</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/help" className="hover:text-white transition-colors">Help Center & FAQ</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="md:grid md:grid-cols-1">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Trust & Legal</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><span className="text-slate-500 select-none">Community Guidelines</span></li>
                  <li><span className="text-slate-500 select-none">Safety Disclaimers</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="mt-12 border-t border-slate-900/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} BorrowIT. All rights reserved. Built for community sharing.
          </p>
          <p className="text-xs text-slate-500">
            Developed and created by Adithya
          </p>
        </div>
      </div>
    </footer>
  );
}
