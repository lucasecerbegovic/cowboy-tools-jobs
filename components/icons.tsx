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

export function Bookmark({
  className,
  size = 16,
  filled = false,
}: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size)} className={className} fill={filled ? 'currentColor' : 'none'}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
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
