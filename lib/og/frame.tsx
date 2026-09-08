import type { ReactNode } from 'react';
import type { OgBadge, OgBadgeTone } from '@/lib/og/copy';

const INK = '#000';
const SURFACE = '#fff';
const MUTED = 'rgba(0,0,0,0.6)';

const BADGE_PAINT: Record<
  OgBadgeTone,
  { color: string; background: string; border: string }
> = {
  default: { color: INK, background: SURFACE, border: INK },
  'full-time': { color: '#163A5F', background: '#D5E6F5', border: '#163A5F' },
  'part-time': { color: '#6B2D5B', background: '#F3D9EC', border: '#6B2D5B' },
  contract: { color: '#8C3A16', background: '#F6DCCE', border: '#8C3A16' },
  apprenticeship: { color: '#7A4A00', background: '#F3E0B5', border: '#7A4A00' },
  union: { color: '#1B4F72', background: '#D0E6F5', border: '#1B4F72' },
  success: { color: SURFACE, background: '#067647', border: '#067647' },
};

function Hairline() {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: 1,
        backgroundColor: INK,
        flexShrink: 0,
      }}
    />
  );
}

function BrandMark({ aside }: { aside?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'Geist Mono',
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: INK,
        }}
      >
        Tradesboard
      </div>
      {aside ? (
        <div
          style={{
            display: 'flex',
            fontFamily: 'Geist Mono',
            fontSize: 18,
            fontWeight: 400,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: MUTED,
          }}
        >
          {aside}
        </div>
      ) : null}
    </div>
  );
}

function OgBadgeChip({ badge }: { badge: OgBadge }) {
  const paint = BADGE_PAINT[badge.tone];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${paint.border}`,
        backgroundColor: paint.background,
        color: paint.color,
        fontFamily: 'Geist Mono',
        fontSize: 18,
        fontWeight: 500,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '8px 12px',
      }}
    >
      {badge.label}
    </div>
  );
}

export function OgFrame({
  aside,
  children,
  footer,
}: {
  aside?: string;
  children: ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: SURFACE,
        padding: 40,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid ${INK}`,
          padding: '44px 52px',
        }}
      >
        <BrandMark aside={aside} />
        <div style={{ display: 'flex', height: 28, flexShrink: 0 }} />
        <Hairline />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            minHeight: 0,
          }}
        >
          {children}
        </div>
        {footer ? (
          <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <Hairline />
            <div style={{ display: 'flex', height: 28, flexShrink: 0 }} />
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function SiteOgCard({
  locale,
  headline,
  description,
  trades,
}: {
  locale: string;
  headline: string;
  description: string;
  trades: string;
}) {
  return (
    <OgFrame
      aside={locale}
      footer={
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            fontFamily: 'Geist Mono',
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: MUTED,
          }}
        >
          {trades}
        </div>
      }
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'Geist',
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: '-0.03em',
          lineHeight: 0.98,
          textTransform: 'uppercase',
          color: INK,
          width: '100%',
        }}
      >
        {headline}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 20,
          fontFamily: 'Geist',
          fontSize: 28,
          fontWeight: 400,
          color: MUTED,
          width: '100%',
        }}
      >
        {description}
      </div>
    </OgFrame>
  );
}

export function JobOgCard({
  headline,
  employer,
  pay,
  badges,
}: {
  headline: string;
  employer: string;
  pay: string;
  badges: OgBadge[];
}) {
  return (
    <OgFrame
      footer={
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {badges.map((badge, i) => (
            <div
              key={`${badge.label}-${i}`}
              style={{ display: 'flex', marginRight: 10, marginBottom: 4 }}
            >
              <OgBadgeChip badge={badge} />
            </div>
          ))}
        </div>
      }
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'Geist',
          fontSize: 56,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.12,
          color: INK,
          width: '100%',
          maxHeight: 190,
          overflow: 'hidden',
        }}
      >
        {headline}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 16,
          fontFamily: 'Geist Mono',
          fontSize: 22,
          fontWeight: 400,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: MUTED,
        }}
      >
        {employer}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 18,
          fontFamily: 'Geist Mono',
          fontSize: 32,
          fontWeight: 500,
          letterSpacing: '0.02em',
          color: INK,
        }}
      >
        {pay}
      </div>
    </OgFrame>
  );
}

export function EmployerOgCard({
  headline,
  location,
  roles,
  verified,
  trades,
}: {
  headline: string;
  location: string;
  roles: string;
  verified: boolean;
  trades: OgBadge[];
}) {
  return (
    <OgFrame
      footer={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {verified ? (
            <div style={{ display: 'flex', marginRight: 10 }}>
              <OgBadgeChip badge={{ label: 'Verified employer', tone: 'success' }} />
            </div>
          ) : null}
          {trades.map((badge, i) => (
            <div
              key={`${badge.label}-${i}`}
              style={{ display: 'flex', marginRight: 10 }}
            >
              <OgBadgeChip badge={badge} />
            </div>
          ))}
        </div>
      }
    >
      <div
        style={{
          display: 'flex',
          fontFamily: 'Geist',
          fontSize: 56,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.12,
          color: INK,
          width: '100%',
          maxHeight: 190,
          overflow: 'hidden',
        }}
      >
        {headline}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 16,
          fontFamily: 'Geist Mono',
          fontSize: 22,
          fontWeight: 400,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: MUTED,
        }}
      >
        {location}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 18,
          fontFamily: 'Geist Mono',
          fontSize: 32,
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: INK,
        }}
      >
        {roles}
      </div>
    </OgFrame>
  );
}
