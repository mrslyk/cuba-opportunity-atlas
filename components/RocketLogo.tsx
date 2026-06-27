/* Cuba-flag rocket — the site mark, matching app/icon.svg (the favicon).
   Self-contained (includes its own navy rounded-square background). */
export function RocketLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Cuba Opportunity Atlas"
    >
      <rect width="100" height="100" rx="22" fill="#0B1B3B" />
      <circle cx="17" cy="19" r="1.5" fill="#fff" opacity="0.85" />
      <circle cx="83" cy="26" r="1.1" fill="#fff" opacity="0.7" />
      <circle cx="22" cy="80" r="1.2" fill="#fff" opacity="0.65" />
      <circle cx="80" cy="78" r="1.4" fill="#fff" opacity="0.8" />
      <path d="M42 70 C44 86 47 92 50 98 C53 92 56 86 58 70 Z" fill="#FF6A00" />
      <path d="M45 70 C46 82 48 87 50 92 C52 87 54 82 55 70 Z" fill="#FFC42E" />
      <path d="M47.5 70 C48 79 49 82 50 85 C51 82 52 79 52.5 70 Z" fill="#FFF3C4" />
      <circle cx="42" cy="90" r="1.6" fill="#FFC42E" />
      <circle cx="58" cy="88" r="1.4" fill="#FF6A00" />
      <path d="M50 56 C49 64 48 70 46.5 76 L53.5 76 C52 70 51 64 50 56 Z" fill="#D4232E" />
      <path d="M39 56 C30 60 27 68 28 74 L39 69 Z" fill="#D4232E" />
      <path d="M61 56 C70 60 73 68 72 74 L61 69 Z" fill="#D4232E" />
      <clipPath id="rocket-body">
        <rect x="39" y="32" width="22" height="38" rx="11" />
      </clipPath>
      <g clipPath="url(#rocket-body)">
        <rect x="39" y="32.0" width="22" height="7.7" fill="#0A3DA8" />
        <rect x="39" y="39.6" width="22" height="7.7" fill="#FFFFFF" />
        <rect x="39" y="47.2" width="22" height="7.7" fill="#0A3DA8" />
        <rect x="39" y="54.8" width="22" height="7.7" fill="#FFFFFF" />
        <rect x="39" y="62.4" width="22" height="7.7" fill="#0A3DA8" />
      </g>
      <rect x="39" y="32" width="22" height="38" rx="11" fill="none" stroke="#FFFFFF" strokeWidth="1.4" />
      <path d="M50 6 C57 16 60 24 60 32 L40 32 C40 24 43 16 50 6 Z" fill="#D4232E" />
      <polygon
        points="50.00,16.80 51.53,20.89 55.90,21.08 52.48,23.80 53.64,28.02 50.00,25.60 46.36,28.02 47.52,23.80 44.10,21.08 48.47,20.89"
        fill="#FFFFFF"
      />
      <path d="M45 70 L55 70 L52.5 75 L47.5 75 Z" fill="#B9C0CC" />
    </svg>
  );
}
