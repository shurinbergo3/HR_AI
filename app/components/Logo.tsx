export function LogoIcon({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="55%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>

        <radialGradient id="logo-radial" cx="30%" cy="20%" r="80%">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="60%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="logo-top-highlight" x1="32" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.28" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="logo-border" x1="32" y1="0" x2="32" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0.08" />
        </linearGradient>

        <radialGradient id="sparkle-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0.9" />
        </radialGradient>

        <filter id="sparkle-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>

        <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>

      {/* Soft drop shadow ground */}
      <rect x="0" y="2" width="64" height="62" rx="14" fill="black" fillOpacity="0.06" />

      {/* Background gradient */}
      <rect width="64" height="64" rx="14" fill="url(#logo-bg)" />

      {/* Radial light from top-left (glass depth) */}
      <rect width="64" height="64" rx="14" fill="url(#logo-radial)" />

      {/* Top highlight strip (glass) */}
      <rect width="64" height="32" rx="14" fill="url(#logo-top-highlight)" />

      {/* Inner border (glass edge) */}
      <rect
        x="0.75" y="0.75" width="62.5" height="62.5" rx="13.25"
        fill="none"
        stroke="url(#logo-border)"
        strokeWidth="1"
      />

      {/* Person silhouette — head */}
      <g filter="url(#logo-shadow)">
        <circle cx="30" cy="25" r="6.5" fill="white" />
      </g>
      <circle cx="30" cy="25" r="6.5" fill="white" />

      {/* Person silhouette — shoulders/torso (filled, more presence) */}
      <path
        d="M16 50 C16 40.5, 22.2 34.5, 30 34.5 C37.8 34.5, 44 40.5, 44 50 L44 52 C44 53.1, 43.1 54, 42 54 L18 54 C16.9 54, 16 53.1, 16 52 Z"
        fill="white"
      />

      {/* AI sparkle — single elegant 4-point star */}
      <g>
        <circle cx="48" cy="16" r="5" fill="white" fillOpacity="0.18" filter="url(#sparkle-glow)" />
        <path
          d="M48 10
             C48 13, 48.4 14, 51 14
             C53.6 14, 54 14.4, 54 16
             C54 17.6, 53.6 18, 51 18
             C48.4 18, 48 19, 48 22
             C48 19, 47.6 18, 45 18
             C42.4 18, 42 17.6, 42 16
             C42 14.4, 42.4 14, 45 14
             C47.6 14, 48 13, 48 10 Z"
          fill="url(#sparkle-grad)"
        />
      </g>
    </svg>
  );
}

export function LogoFull({ iconSize = 36 }: { iconSize?: number }) {
  return (
    <div className="flex items-center gap-3">
      <LogoIcon size={iconSize} />
      <div className="flex flex-col leading-none gap-1">
        <span className="text-[18px] font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          HR AI
        </span>
        <span className="text-[9px] font-semibold text-gray-400 tracking-[0.18em] uppercase">
          Assistant
        </span>
      </div>
    </div>
  );
}
