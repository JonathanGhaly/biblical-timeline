import React from "react";

interface CopticCrossProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const CopticCross: React.FC<CopticCrossProps> = ({
  className = "text-[#D4AF37]",
  size = 24,
  glow = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block transition-transform duration-300 hover:scale-110 ${
        glow ? "filter drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" : ""
      } ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="copticGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBF0B9" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8C6F12" />
        </linearGradient>
        <linearGradient id="copticCrimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C41E3A" />
          <stop offset="70%" stopColor="#800020" />
          <stop offset="100%" stopColor="#4A0012" />
        </linearGradient>
      </defs>

      {/* Outer Ornamental Halo / Ring */}
      <circle
        cx="50"
        cy="50"
        r="32"
        stroke="url(#copticGoldGrad)"
        strokeWidth="2.5"
        strokeDasharray="3 3"
        fill="none"
        opacity="0.75"
      />
      
      {/* 4 Corner Trefoil / Ornamental Points */}
      <circle cx="28" cy="28" r="3.5" fill="url(#copticGoldGrad)" />
      <circle cx="72" cy="28" r="3.5" fill="url(#copticGoldGrad)" />
      <circle cx="28" cy="72" r="3.5" fill="url(#copticGoldGrad)" />
      <circle cx="72" cy="72" r="3.5" fill="url(#copticGoldGrad)" />

      {/* Main Vertical Shaft */}
      <path
        d="M45 12 H55 V88 H45 Z"
        fill="url(#copticGoldGrad)"
        stroke="#8C6F12"
        strokeWidth="1"
      />

      {/* Main Horizontal Beam */}
      <path
        d="M12 45 H88 V55 H12 Z"
        fill="url(#copticGoldGrad)"
        stroke="#8C6F12"
        strokeWidth="1"
      />

      {/* Coptic Cross Flared Terminals (Top) */}
      <path
        d="M40 12 L50 4 L60 12 L55 17 L45 17 Z"
        fill="url(#copticGoldGrad)"
      />
      <circle cx="50" cy="4" r="2.5" fill="url(#copticCrimsonGrad)" />

      {/* Coptic Cross Flared Terminals (Bottom) */}
      <path
        d="M40 88 L50 96 L60 88 L55 83 L45 83 Z"
        fill="url(#copticGoldGrad)"
      />
      <circle cx="50" cy="96" r="2.5" fill="url(#copticCrimsonGrad)" />

      {/* Coptic Cross Flared Terminals (Left) */}
      <path
        d="M12 40 L4 50 L12 60 L17 55 L17 45 Z"
        fill="url(#copticGoldGrad)"
      />
      <circle cx="4" cy="50" r="2.5" fill="url(#copticCrimsonGrad)" />

      {/* Coptic Cross Flared Terminals (Right) */}
      <path
        d="M88 40 L96 50 L88 60 L83 55 L83 45 Z"
        fill="url(#copticGoldGrad)"
      />
      <circle cx="96" cy="50" r="2.5" fill="url(#copticCrimsonGrad)" />

      {/* Central Rosette / Medallion */}
      <circle cx="50" cy="50" r="14" fill="url(#copticCrimsonGrad)" stroke="url(#copticGoldGrad)" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="8" fill="url(#copticGoldGrad)" />
      <circle cx="50" cy="50" r="3.5" fill="#4A0012" />
    </svg>
  );
};
