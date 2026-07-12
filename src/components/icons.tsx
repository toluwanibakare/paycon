export function IconAjo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 2v8M20 30v8M2 20h8M30 20h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 8l5.5 5.5M26.5 26.5L32 32M32 8l-5.5 5.5M13.5 26.5L8 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function IconGoal({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <path d="M20 4a16 16 0 100 32 16 16 0 000-32z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 12a8 8 0 100 16 8 8 0 000-16z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 18l3 3-3 3-3-3 3-3z" fill="currentColor" />
      <path d="M20 2v4M20 34v4M2 20h4M34 20h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function IconEmergency({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <path d="M20 4C11.163 4 4 11.163 4 20s7.163 16 16 16 16-7.163 16-16S28.837 4 20 4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 12v10M20 26v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 20h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function IconFlex({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <circle cx="14" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="26" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="26" r="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="26" cy="26" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 8v12M14 20v12M26 8v12M26 20v12" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    </svg>
  );
}

export function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <circle cx="14" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="26" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 32c0-6 4.477-8 10-8s10 2 10 8M16 32c0-6 4.477-8 10-8s10 2 10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconNetwork({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="28" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="28" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 13l-8 12M20 13l8 12M12 28h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconPlatform({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="32" height="32" rx="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 10h12M14 16h12M14 22h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="26" cy="26" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M28 28l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconAuto({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <path d="M20 4a16 16 0 100 32 16 16 0 000-32z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 20l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function IconCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function IconSend({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
