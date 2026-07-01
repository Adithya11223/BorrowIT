// Privacy.jsx - Privacy policy text details for BorrowIT

import React from 'react';
import { Card } from '../components/UI';

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-white mb-6">Privacy Policy</h1>
      <Card className="p-6 bg-[#1A1A1C] border-[#2A2A2D] leading-relaxed space-y-6 text-xs text-slate-500 font-sans" hoverable={false}>
        <p className="text-sm text-slate-200 font-semibold">Last Updated: June 2026</p>
        
        <div>
          <h3 className="text-sm font-bold text-white mb-2">1. Information We Collect</h3>
          <p>
            We collect personal details such as names, email addresses, phone numbers, and location coordinates to facilitate item sharing. User verification data is securely handled and used purely to calculate Trust Scores.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-2">2. How We Use Information</h3>
          <p>
            Your location is used to display proximity distance values to prospective borrowers. Contact credentials (email, phone) are shared with another user ONLY after a borrow request has been explicitly accepted by you.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-2">3. Cookies and Storage</h3>
          <p>
            We utilize local browser storage (such as localStorage) to cache wishlist selections and active session status variables for seamless page reloading. We do not track cross-site cookies.
          </p>
        </div>
      </Card>
    </div>
  );
}
