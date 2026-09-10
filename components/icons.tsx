/** Icons are 1.4px stroke, no fill. docs/brand-guidelines.md § Header */
type IconProps = { className?: string; size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export function ChevronLeft({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function ChevronRight({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function ChevronDown({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function Search({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function Close({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export function Share({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <path d="M16 6l-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  );
}

export function Check({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className} strokeWidth={2}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function Menu({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

/** Lightning bolt — electrician. */
export function Bolt({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M13 2L6 13h6l-2 9 9-13h-6l2-7z" />
    </svg>
  );
}

/** Open-ended wrench — plumber / pipefitter. */
export function Wrench({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M8 4h3.5V7H9.5" />
      <path d="M15 4h3v7h-4" />
      <path d="M13.5 10.5L6 21" />
      <circle cx="5.2" cy="21" r="1.8" />
    </svg>
  );
}

/** Claw hammer — carpenter. */
export function Hammer({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M13 4.5h6v4h-6z" />
      <path d="M13 5.5l-2.5-1.5v7l2.5-1.5" />
      <path d="M16 8.5L8 21" />
    </svg>
  );
}

/** Flame — welder. */
export function Flame({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3c1 4-4 6-4 11a4 4 0 008 0c0-3.5-2.5-5-2.5-8.5C13.5 7 13 5 12 3z" />
      <path d="M12 13c.2 1.2-.6 2.2-.6 3.4" />
    </svg>
  );
}

/** Gear — millwright / industrial mechanic. */
export function Gear({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v2.2M12 17.8V20M4 12h2.2M17.8 12H20" />
      <path d="M6.3 6.3l1.6 1.6M16.1 16.1l1.6 1.6M6.3 17.7l1.6-1.6M16.1 7.9l1.6-1.6" />
    </svg>
  );
}

/** Snowflake — HVAC / refrigeration. */
export function Snowflake({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3v18" />
      <path d="M12 12L5.5 7.5M12 12l6.5-4.5M12 12L5.5 16.5M12 12l6.5 4.5" />
      <path d="M5.5 7.5l2-3M5.5 7.5l-3 1.5M18.5 7.5l-2-3M18.5 7.5l3 1.5" />
      <path d="M5.5 16.5l-3-1.5M5.5 16.5l2 3M18.5 16.5l3-1.5M18.5 16.5l-2 3" />
    </svg>
  );
}

/** Side-view excavator — heavy equipment. */
export function Excavator({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 19h11" />
      <path d="M4.5 19v-5h8v5" />
      <path d="M7 14V9.5h4.5L14 14" />
      <path d="M12.5 11.5l6-5.5 2.2 1.2" />
      <path d="M20.7 7.2l1.3 2.8h-3.2" />
    </svg>
  );
}

/** Hard hat — other trades. */
export function HardHat({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 14h16" />
      <path d="M5 14a7 7 0 0114 0" />
      <path d="M12 7v3" />
      <path d="M3.5 14v2.5h17V14" />
    </svg>
  );
}
