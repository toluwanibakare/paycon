"use client";

export default function HeroIllustration() {
  return (
    <div className="relative mx-auto mt-12 flex h-[320px] w-full max-w-lg items-center justify-center sm:h-[400px]">
      <svg
        viewBox="0 0 500 400"
        className="h-full w-full"
        fill="none"
      >
        <defs>
          <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBCC5C" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FBCC5C" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#008751" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#008751" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="purpleGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2A3CB0" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2A3CB0" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="250" cy="200" r="160" fill="url(#goldGlow)" opacity="0.6" />
        <circle cx="250" cy="200" r="130" fill="url(#greenGlow)" opacity="0.4" />
        <circle cx="250" cy="200" r="100" fill="url(#purpleGlow)" opacity="0.3" />

        <circle cx="250" cy="200" r="140" stroke="#FBCC5C" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.3" />

        <circle cx="250" cy="200" r="95" stroke="#008751" strokeWidth="0.5" strokeDasharray="3 8" opacity="0.25" />

        <g filter="url(#glow)">
          <circle cx="250" cy="105" r="22" fill="#0A0B1A" stroke="#FBCC5C" strokeWidth="2" />
          <circle cx="250" cy="105" r="8" fill="#FBCC5C" opacity="0.8" />
        </g>

        <g filter="url(#glow)">
          <circle cx="335" cy="155" r="20" fill="#0A0B1A" stroke="#008751" strokeWidth="2" />
          <circle cx="335" cy="155" r="7" fill="#008751" opacity="0.8" />
        </g>

        <g filter="url(#glow)">
          <circle cx="310" cy="270" r="20" fill="#0A0B1A" stroke="#2A3CB0" strokeWidth="2" />
          <circle cx="310" cy="270" r="7" fill="#2A3CB0" opacity="0.8" />
        </g>

        <g filter="url(#glow)">
          <circle cx="190" cy="270" r="20" fill="#0A0B1A" stroke="#FBCC5C" strokeWidth="2" />
          <circle cx="190" cy="270" r="7" fill="#FBCC5C" opacity="0.8" />
        </g>

        <g filter="url(#glow)">
          <circle cx="165" cy="155" r="20" fill="#0A0B1A" stroke="#008751" strokeWidth="2" />
          <circle cx="165" cy="155" r="7" fill="#008751" opacity="0.8" />
        </g>

        <path d="M250 127 L335 155" stroke="white" strokeWidth="1" opacity="0.15" />
        <path d="M335 175 L310 270" stroke="white" strokeWidth="1" opacity="0.15" />
        <path d="M310 250 L190 270" stroke="white" strokeWidth="1" opacity="0.15" />
        <path d="M190 250 L165 155" stroke="white" strokeWidth="1" opacity="0.15" />
        <path d="M165 135 L250 127" stroke="white" strokeWidth="1" opacity="0.15" />

        <path d="M250 127 L310 270" stroke="#FBCC5C" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
        <path d="M335 155 L190 270" stroke="#008751" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
        <path d="M165 155 L310 270" stroke="#2A3CB0" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />

        <circle cx="250" cy="200" r="3" fill="#FBCC5C" opacity="0.5" />

        <path d="M240 200 L230 180" stroke="#FBCC5C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M260 200 L270 180" stroke="#008751" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <path d="M250 210 L250 225" stroke="#2A3CB0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

        <g opacity="0.4">
          <path d="M0 50 L500 50" stroke="white" strokeWidth="0.5" opacity="0.05" />
          <path d="M0 100 L500 100" stroke="white" strokeWidth="0.5" opacity="0.05" />
          <path d="M0 150 L500 150" stroke="white" strokeWidth="0.5" opacity="0.05" />
          <path d="M0 200 L500 200" stroke="white" strokeWidth="0.5" opacity="0.05" />
          <path d="M0 250 L500 250" stroke="white" strokeWidth="0.5" opacity="0.05" />
          <path d="M0 300 L500 300" stroke="white" strokeWidth="0.5" opacity="0.05" />
          <path d="M0 350 L500 350" stroke="white" strokeWidth="0.5" opacity="0.05" />
          <path d="M50 0 L50 400" stroke="white" strokeWidth="0.5" opacity="0.05" />
          <path d="M150 0 L150 400" stroke="white" strokeWidth="0.5" opacity="0.05" />
          <path d="M250 0 L250 400" stroke="white" strokeWidth="0.5" opacity="0.05" />
          <path d="M350 0 L350 400" stroke="white" strokeWidth="0.5" opacity="0.05" />
          <path d="M450 0 L450 400" stroke="white" strokeWidth="0.5" opacity="0.05" />
        </g>
      </svg>
    </div>
  );
}
