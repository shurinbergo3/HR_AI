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
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <linearGradient id="logo-glass" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="logo-accent" x1="20" y1="16" x2="44" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.95" />
          <stop offset="100%" stopColor="white" stopOpacity="0.75" />
        </linearGradient>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <clipPath id="logo-clip">
          <rect x="0" y="0" width="64" height="64" rx="16" />
        </clipPath>
      </defs>

      {/* Background rounded square */}
      <rect width="64" height="64" rx="16" fill="url(#logo-bg)" />

      {/* Glass overlay */}
      <rect width="64" height="64" rx="16" fill="url(#logo-glass)" />

      {/* Inner border for glass depth */}
      <rect
        x="1" y="1" width="62" height="62" rx="15"
        stroke="white" strokeOpacity="0.25" strokeWidth="1" fill="none"
      />

      {/* Person head */}
      <circle cx="32" cy="22" r="7" fill="url(#logo-accent)" />

      {/* Person body arc */}
      <path
        d="M18 48 C18 38, 24 32, 32 32 C40 32, 46 38, 46 48"
        stroke="url(#logo-accent)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* AI neural nodes */}
      <g filter="url(#logo-glow)">
        {/* Top-right sparkle node */}
        <circle cx="47" cy="14" r="2.5" fill="white" fillOpacity="0.9" />
        <circle cx="47" cy="14" r="4.5" fill="white" fillOpacity="0.15" />

        {/* Connection line from head to node */}
        <line
          x1="37" y1="17" x2="45" y2="15"
          stroke="white" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 2"
        />

        {/* Small accent node left */}
        <circle cx="15" cy="18" r="1.8" fill="white" fillOpacity="0.7" />
        <circle cx="15" cy="18" r="3.5" fill="white" fillOpacity="0.1" />

        {/* Connection line */}
        <line
          x1="25" y1="20" x2="17" y2="18"
          stroke="white" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 2"
        />

        {/* Bottom sparkle */}
        <circle cx="50" cy="40" r="2" fill="white" fillOpacity="0.6" />
        <circle cx="50" cy="40" r="3.5" fill="white" fillOpacity="0.1" />

        {/* Connection to body */}
        <line
          x1="45" y1="40" x2="48" y2="40"
          stroke="white" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 2"
        />
      </g>

      {/* Top-left light reflection */}
      <ellipse
        cx="22" cy="14" rx="12" ry="6"
        fill="white" fillOpacity="0.1"
        clipPath="url(#logo-clip)"
      />
    </svg>
  );
}

export function LogoFull({ iconSize = 36 }: { iconSize?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={iconSize} />
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
          HR AI
        </span>
        <span className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">
          Assistant
        </span>
      </div>
    </div>
  );
}
