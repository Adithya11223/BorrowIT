// Logo.jsx - Renders the actual cropped transparent logo images for BorrowIT

import React from 'react';

export default function Logo({ className = '', showText = true, size = 'md', vertical = false, useFull = false }) {
  // Size calculations
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const subTextSizes = {
    sm: 'text-[7.5px]',
    md: 'text-[9.5px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  if (useFull) {
    return (
      <div className={`inline-flex flex-col items-center justify-center ${className}`}>
        <img 
          src="/logo_full.png" 
          alt="BorrowIT Logo" 
          className={`${iconSizes[size]} h-auto object-contain select-none pointer-events-none`} 
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex ${vertical ? 'flex-col' : 'flex-row'} items-center gap-2.5 ${className}`}>
      {/* Actual cropped logo icon */}
      <img 
        src="/logo_icon.png" 
        alt="BorrowIT" 
        className={`${iconSizes[size]} object-contain select-none pointer-events-none`} 
      />

      {showText && (
        <div className={`flex flex-col ${vertical ? 'items-center text-center' : 'items-start'} select-none`}>
          <span className={`${textSizes[size]} font-black tracking-tight text-white`}>
            Borrow <span className="text-[#FF5E00]">IT</span>
          </span>
          <div className="flex items-center gap-1">
            <span className={`${subTextSizes[size]} font-semibold text-white uppercase tracking-wider`}>
              <span className="text-slate-500">—</span> <span className="text-[#FF5E00]">Borrow.</span> Save. Share. <span className="text-slate-500">—</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
