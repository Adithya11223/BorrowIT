// AuthAnimation.jsx - Custom flat-vector character illustration inspired by tech-minimal design

import React, { useId } from 'react';

const styles = `
@keyframes breathing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@keyframes blink {
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}
@keyframes float1 {
  0%, 100% { transform: translateY(0) rotate(1deg); }
  50% { transform: translateY(-12px) rotate(-1deg); }
}
@keyframes float2 {
  0%, 100% { transform: translateY(0) rotate(-1.5deg); }
  50% { transform: translateY(-8px) rotate(1deg); }
}
@keyframes float3 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}
@keyframes float4 {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
  50% { transform: translateY(-10px) scale(1.1); opacity: 1; }
}
@keyframes phoneScroll {
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
}
@keyframes pulseGlow {
  0% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.05); }
  100% { opacity: 0.2; transform: scale(1); }
}
`;

export default function AuthAnimation() {
  const gradientId = useId();
  const glowId = useId();

  return (
    <div className="relative w-full max-w-lg mx-auto" style={{ aspectRatio: '16/11' }}>
      <style>{styles}</style>
      <svg 
        viewBox="0 0 500 340" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF5E00" />
            <stop offset="100%" stopColor="#FF3C00" />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5E00" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FF5E00" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ===== SOFT BACKGROUND GLOW ===== */}
        <circle 
          cx="250" 
          cy="170" 
          r="160" 
          fill={`url(#${glowId})`} 
          style={{ animation: 'pulseGlow 6s ease-in-out infinite' }} 
        />

        {/* ===== SOFA (Modern Minimalist Line / Blocks) ===== */}
        <g opacity="0.9">
          {/* Backrest cushion */}
          <path d="M 90 240 C 90 210 110 190 250 190 C 390 190 410 210 410 240 L 410 280 L 90 280 Z" fill="#161618" stroke="#2A2A2D" strokeWidth="1.5" />
          {/* Left Armrest */}
          <rect x="70" y="225" width="28" height="60" rx="10" fill="#1C1C1E" stroke="#2A2A2D" strokeWidth="1.5" />
          {/* Right Armrest */}
          <rect x="402" y="225" width="28" height="60" rx="10" fill="#1C1C1E" stroke="#2A2A2D" strokeWidth="1.5" />
          {/* Seat Cushion */}
          <rect x="90" y="255" width="320" height="30" rx="8" fill="#1C1C1E" stroke="#2A2A2D" strokeWidth="1.5" />
          {/* Legs */}
          <rect x="110" y="285" width="8" height="15" rx="2" fill="#2A2A2D" />
          <rect x="382" y="285" width="8" height="15" rx="2" fill="#2A2A2D" />
        </g>

        {/* ===== SOFA SHADOW ===== */}
        <ellipse cx="250" cy="302" rx="180" ry="8" fill="#FF5E00" opacity="0.08" />

        {/* ===== CHARACTER (Stylized vector, sitting & browsing) ===== */}
        <g style={{ animation: 'breathing 5s ease-in-out infinite', transformOrigin: '250px 240px' }}>
          
          {/* Long Left Leg (draped over sofa) */}
          <path 
            d="M 210 230 C 230 245 280 245 340 245 Q 350 245 352 250 L 342 260 C 285 260 245 255 205 240 Z" 
            fill={`url(#${gradientId})`} 
          />
          {/* Left Foot (White Sneaker) */}
          <path d="M 352 250 L 366 247 C 370 247 372 251 370 255 L 364 260 Z" fill="#FFFFFF" />
          <path d="M 352 250 L 360 252" stroke="#FF5E00" strokeWidth="1.5" />

          {/* Long Right Leg (crossed) */}
          <path 
            d="M 205 232 C 220 242 260 250 305 268 Q 315 272 314 278 L 303 285 C 270 268 230 258 200 242 Z" 
            fill="#E05300" 
          />
          {/* Right Foot (White Sneaker) */}
          <path d="M 314 278 L 326 281 C 329 282 331 286 329 289 L 322 293 Z" fill="#FFFFFF" />
          <path d="M 314 278 L 320 282" stroke="#FF5E00" strokeWidth="1.5" />

          {/* Torso / Sweater (Navy Blue Tech Block) */}
          <path d="M 185 142 C 165 170 160 210 178 235 C 188 245 210 245 224 235 C 232 205 228 170 212 142 Z" fill="#131F33" stroke="#253550" strokeWidth="1.5" />

          {/* Neck */}
          <rect x="194" y="132" width="8" height="12" fill="#FBCBCB" />

          {/* Stylized Head (Skin tone, simple) */}
          <circle cx="198" cy="120" r="14" fill="#FBCBCB" />
          
          {/* Minimalist Face elements (Visor cap & Nose) */}
          <path d="M 199 119 L 202 121 L 199 123 Z" fill="#A87E7E" /> {/* nose */}
          <circle cx="194" cy="119" r="1.5" fill="#1C1C1E" style={{ animation: 'blink 4s linear infinite', transformOrigin: '194px 119px' }} /> {/* eye */}

          {/* Orange Cap (Rider Cap style) */}
          <path d="M 184 120 C 184 108 194 106 206 112 L 216 110 Q 212 118 202 122 Z" fill="#FF5E00" />
          <circle cx="195" cy="109" r="2.5" fill="#FFFFFF" opacity="0.3" />

          {/* Right Arm (Holding phone) */}
          <path d="M 210 155 C 235 170 255 180 268 198" stroke="#131F33" strokeWidth="12" strokeLinecap="round" fill="none" />
          {/* Hand */}
          <circle cx="270" cy="201" r="6" fill="#FBCBCB" />

          {/* Mobile Phone (White outline, orange screen) */}
          <g>
            <rect x="270" y="186" width="13" height="26" rx="2" fill="#FFFFFF" stroke="#2A2A2D" strokeWidth="1" />
            <rect x="272" y="188" width="9" height="22" rx="1" fill="#FF5E00" opacity="0.9" />
            {/* Scrolling Feed Indicator */}
            <g style={{ animation: 'phoneScroll 3s ease-in-out infinite' }}>
              <rect x="274" y="190" width="5" height="4" rx="0.5" fill="#FFFFFF" opacity="0.8" />
              <rect x="274" y="196" width="5" height="4" rx="0.5" fill="#FFFFFF" opacity="0.5" />
              <rect x="274" y="202" width="5" height="4" rx="0.5" fill="#FFFFFF" opacity="0.5" />
            </g>
          </g>

          {/* Left Arm (Relaxed on back of sofa) */}
          <path d="M 180 155 C 160 162 145 178 140 195" stroke="#131F33" strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="138" cy="198" r="5" fill="#FBCBCB" />
        </g>

        {/* ===== FLOATING UI CARD 1 (Canon Camera) ===== */}
        <g style={{ animation: 'float1 5.5s ease-in-out infinite' }}>
          {/* Card Frame */}
          <rect x="310" y="45" width="130" height="52" rx="16" fill="#1A1A1C" stroke="#2A2A2D" strokeWidth="1.5" />
          {/* Item Image representation */}
          <rect x="320" y="55" width="32" height="32" rx="10" fill="#FFFFFF" />
          <path d="M 326 73 L 333 66 L 340 73 L 346 67 L 346 77 L 326 77 Z" fill="#E2E8F0" />
          <circle cx="336" cy="62" r="3" fill="#FF5E00" />
          {/* Text lines */}
          <rect x="360" y="58" width="55" height="5" rx="2" fill="#FFFFFF" />
          <rect x="360" y="68" width="40" height="4" rx="2" fill="#FF5E00" />
          <rect x="360" y="78" width="25" height="4" rx="2" fill="#555558" />
          {/* Location pin dot */}
          <circle cx="425" cy="58" r="3.5" fill="#22C55E" />
        </g>

        {/* ===== FLOATING UI CARD 2 (Camping Tent) ===== */}
        <g style={{ animation: 'float2 6.5s ease-in-out infinite' }}>
          {/* Card Frame */}
          <rect x="50" y="110" width="120" height="52" rx="16" fill="#1A1A1C" stroke="#2A2A2D" strokeWidth="1.5" />
          {/* Item Image representation */}
          <rect x="60" y="120" width="32" height="32" rx="10" fill="#FFFFFF" />
          <polygon points="76,126 84,142 68,142" fill="#FF5E00" opacity="0.9" />
          <polygon points="76,126 80,142 72,142" fill="#D84F00" />
          {/* Text lines */}
          <rect x="100" y="123" width="50" height="5" rx="2" fill="#FFFFFF" />
          <rect x="100" y="133" width="35" height="4" rx="2" fill="#FF5E00" />
          <rect x="100" y="143" width="20" height="4" rx="2" fill="#555558" />
        </g>

        {/* ===== FLOATING SEARCH BUBBLE ===== */}
        <g style={{ animation: 'float3 4.5s ease-in-out infinite' }}>
          <circle cx="105" cy="60" r="20" fill="#FF5E00" fillOpacity="0.1" stroke="#FF5E00" strokeWidth="1.5" />
          <circle cx="102" cy="58" r="6" stroke="#FF5E00" strokeWidth="2.2" fill="none" />
          <line x1="106" y1="62" x2="114" y2="70" stroke="#FF5E00" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* ===== FLOATING LOCATION BUBBLE ===== */}
        <g style={{ animation: 'float4 5s ease-in-out infinite' }}>
          <rect x="235" y="120" width="50" height="20" rx="10" fill="#1A1A1C" stroke="#2A2A2D" strokeWidth="1" />
          <circle cx="245" cy="130" r="3" fill="#FF5E00" />
          <text x="252" y="134" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">2.1 km</text>
        </g>

        {/* ===== FLOATING STAR RATING ===== */}
        <g style={{ animation: 'float3 3.8s ease-in-out infinite' }}>
          <polygon points="302,126 305,133 312,134 307,139 308,146 302,142 296,146 297,139 292,134 299,133" fill="#FF5E00" />
          <circle cx="302" cy="135" r="16" stroke="#FF5E00" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
        </g>

      </svg>
    </div>
  );
}
