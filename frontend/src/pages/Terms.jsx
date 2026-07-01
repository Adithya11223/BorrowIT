// Terms.jsx - Terms of service details for BorrowIT

import React from 'react';
import { Card } from '../components/UI';

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-white mb-6">Terms of Service</h1>
      <Card className="p-6 bg-[#1A1A1C] border-[#2A2A2D] leading-relaxed space-y-6 text-xs text-slate-500 font-sans" hoverable={false}>
        <p className="text-sm text-slate-200 font-semibold">Last Updated: June 2026</p>
        
        <div>
          <h3 className="text-sm font-bold text-white mb-2">1. Sharing Guidelines</h3>
          <p>
            Members agree to list items in good working condition. Listing illegal or hazardous materials is strictly prohibited and will result in immediate profile suspension.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-2">2. Liability</h3>
          <p>
            BorrowIT facilitates catalog indexing, scheduling, and notifications. We are not responsible for accidental damages, losses or disputes between lenders and borrowers, though we offer community resolution mediation.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white mb-2">3. Returns & Penalties</h3>
          <p>
            Borrowers agree to return items on or before the selected End Date in original condition. Late returns or damage reports impact Trust Scores, and can lead to permanent profile bans.
          </p>
        </div>
      </Card>
    </div>
  );
}
