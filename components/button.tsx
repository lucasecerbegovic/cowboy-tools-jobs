import Link from 'next/link';
import { mono } from '@/lib/brand-type';

type Variant = 'fill' | 'outline' | 'bare';
type Size = 'default' | 'lg' | 'sm';

const VARIANTS: Record<Variant, string> = {
  // Named exception: the large primary CTA inverts rather than fading.
  fill: 'border border-ink bg-ink text-surface hover:opacity-70',
  outline: 'border border-ink bg-surface text-ink hover:opacity-70',
  bare: 'border-0 bg-transparent text-ink underline-offset-4 hover:underline',
};

const SIZES: Record<Size, string> = {
  default: `${mono.button} h-[var(--button-h)] min-h-[var(--tap-min)] px-[18px]`,
  lg: `${mono.buttonLg} h-[var(--button-h-lg)] min-h-[var(--tap-min)] px-6`,
  sm: `${mono.badge} min-h-[var(--tap-min)] px-3`,
};

export function buttonClass(variant: Variant = 'fill', size: Size = 'default') {
  return [
    'inline-flex items-center justify-center gap-2 rounded-none',
    'transition-opacity duration-150 disabled:opacity-35',
    'disabled:pointer-events-none whitespace-nowrap max-sm:whitespace-normal',
    SIZES[size],
    VARIANTS[variant],
  ].join(' ');
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = 'fill',
  size = 'default',
  className = '',
  ...props
}: ButtonProps) {
  return <button {...props} className={`${buttonClass(variant, size)} ${className}`} />;
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonLink({
  variant = 'fill',
  size = 'default',
  className = '',
  ...props
}: ButtonLinkProps) {
  return <Link {...props} className={`${buttonClass(variant, size)} ${className}`} />;
}

type ButtonAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
};

export function ButtonAnchor({
  variant = 'fill',
  size = 'default',
  className = '',
  ...props
}: ButtonAnchorProps) {
  return <a {...props} className={`${buttonClass(variant, size)} ${className}`} />;
}
