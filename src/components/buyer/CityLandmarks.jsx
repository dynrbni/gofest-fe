import React from 'react';

function Monas() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <circle cx="60" cy="60" r="46" fill="#fed7aa" />
      <ellipse cx="60" cy="97" rx="30" ry="4.5" fill="#f97316" opacity="0.25" />
      <rect x="30" y="88" width="60" height="7" rx="2.5" fill="#e2e8f0" />
      <rect x="36" y="81" width="48" height="7" rx="2.5" fill="#f1f5f9" />
      <polygon points="57,26 63,26 61.5,81 58.5,81" fill="#ffffff" />
      <polygon points="60,26 63,26 61.5,81 60,81" fill="#e2e8f0" />
      <rect x="56.5" y="21" width="7" height="5" rx="1" fill="#f1f5f9" />
      <path d="M60 8 C63.5 13 64.5 17 60 20.5 C55.5 17 56.5 13 60 8 Z" fill="#f59e0b" />
      <path d="M60 10.5 C61.8 13.6 62 16.2 60 18.8 C58 16.2 58.2 13.6 60 10.5 Z" fill="#fcd34d" />
      <circle cx="44" cy="46" r="1.6" fill="#fdba74" />
      <circle cx="78" cy="40" r="1.3" fill="#fdba74" />
      <circle cx="74" cy="60" r="1.1" fill="#fdba74" />
    </svg>
  );
}

function MasjidAgung() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <circle cx="60" cy="60" r="46" fill="#dbeafe" />
      <ellipse cx="60" cy="97" rx="32" ry="4.5" fill="#2563eb" opacity="0.22" />
      <rect x="24" y="52" width="7" height="38" rx="2" fill="#f8fafc" />
      <polygon points="24,52 31,52 27.5,44" fill="#3b82f6" />
      <circle cx="27.5" cy="42" r="1.6" fill="#fbbf24" />
      <rect x="89" y="52" width="7" height="38" rx="2" fill="#f8fafc" />
      <polygon points="89,52 96,52 92.5,44" fill="#3b82f6" />
      <circle cx="92.5" cy="42" r="1.6" fill="#fbbf24" />
      <rect x="34" y="74" width="52" height="16" rx="2" fill="#ffffff" />
      <path d="M55 90 v-5.5 a5 5 0 0 1 10 0 v6 Z" fill="#1e40af" />
      <path d="M40 74 v-8 a20 14 0 0 1 40 0 v8 Z" fill="#3b82f6" />
      <path d="M45 60 a18 12 0 0 1 11 -8" stroke="#93c5fd" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="59" y="44" width="2" height="6" fill="#fbbf24" />
      <circle cx="60" cy="42.5" r="2" fill="#fbbf24" />
    </svg>
  );
}

function TuguJogja() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <circle cx="60" cy="60" r="46" fill="#ede9fe" />
      <ellipse cx="60" cy="97" rx="28" ry="4.5" fill="#8b5cf6" opacity="0.25" />
      <ellipse cx="60" cy="91" rx="26" ry="5" fill="#ddd6fe" />
      <polygon points="56.5,34 63.5,34 62.5,88 57.5,88" fill="#ffffff" />
      <polygon points="60,34 63.5,34 62.5,88 60,88" fill="#e2e8f0" />
      <rect x="55.5" y="38.5" width="9" height="2.5" rx="1.2" fill="#fbbf24" />
      <polygon points="55,34 65,34 63.5,28.5 56.5,28.5" fill="#f1f5f9" />
      <rect x="57.5" y="24.5" width="5" height="4" rx="1" fill="#f1f5f9" />
      <polygon points="58.5,24.5 61.5,24.5 60,17.5" fill="#f1f5f9" />
      <circle cx="60" cy="16" r="2.2" fill="#fbbf24" />
      <circle cx="42" cy="52" r="1.5" fill="#c4b5fd" />
      <circle cx="80" cy="46" r="1.2" fill="#c4b5fd" />
      <circle cx="76" cy="66" r="1" fill="#c4b5fd" />
    </svg>
  );
}

function Suramadu() {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <circle cx="60" cy="60" r="46" fill="#ccfbf1" />
      <rect x="16" y="84" width="88" height="9" rx="4.5" fill="#99f6e4" />
      <path d="M22 88.5 h12 M44 88.5 h14 M70 88.5 h12" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" />
      <rect x="20" y="66" width="80" height="5" rx="2.5" fill="#ffffff" />
      <path
        d="M60 30 L36 66 M60 38 L42 66 M60 46 L50 66 M60 54 L56 66 M60 30 L84 66 M60 38 L78 66 M60 46 L70 66 M60 54 L64 66"
        stroke="#94a3b8"
        strokeWidth="1.2"
      />
      <polygon points="60,28 66,70 60,75 54,70" fill="#f8fafc" />
      <polygon points="60,28 66,70 60,75" fill="#e2e8f0" />
      <rect x="59" y="21" width="2" height="8" rx="1" fill="#cbd5e1" />
      <ellipse cx="60" cy="97" rx="32" ry="4" fill="#0d9488" opacity="0.2" />
    </svg>
  );
}

const LANDMARKS = {
  monas: Monas,
  masjid: MasjidAgung,
  tugu: TuguJogja,
  suramadu: Suramadu,
};

export default function CityLandmark({ type }) {
  const Landmark = LANDMARKS[type];
  if (!Landmark) return null;
  return <Landmark />;
}
