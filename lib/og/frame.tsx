import type { ReactNode } from 'react';
import type { OgCells } from '@/lib/og/copy';
import { OG_SITE_NAME } from '@/lib/site';

const BAR_BORDER = '1px solid rgba(255,255,255,0.22)';
const MUTED_LINE = 'rgba(255,255,255,0.4)';
const MUTED_META = 'rgba(255,255,255,0.6)';
const MUTED_EYEBROW = 'rgba(255,255,255,0.5)';

function OgCellsBar({ cells }: { cells: OgCells }) {
  return (
    <div
      style={{
        display: 'flex',
        borderTop: BAR_BORDER,
        position: 'relative',
      }}
    >
      {cells.map((label, index) => (
        <div
          key={`${label}-${index}`}
          style={{
            flex: 1,
            display: 'flex',
            padding: index === 0 ? '30px 30px 32px 64px' : '30px 30px 32px 30px',
            borderLeft: index === 0 ? 'none' : BAR_BORDER,
          }}
        >
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 15,
              letterSpacing: '0.04em',
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function OgInkCanvas({
  logoUrl,
  eyebrow,
  cells,
  children,
}: {
  logoUrl: string;
  eyebrow: string;
  cells: OgCells;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        background: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 60px)',
        }}
      />
      <img
        src={logoUrl}
        alt={OG_SITE_NAME}
        width={375}
        height={375}
        style={{
          position: 'absolute',
          top: -26,
          right: 8,
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          padding: '54px 64px 0',
          position: 'relative',
        }}
      >
        <span
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 13,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: MUTED_EYEBROW,
          }}
        >
          {eyebrow}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 64px',
          position: 'relative',
          minHeight: 0,
        }}
      >
        {children}
      </div>
      <OgCellsBar cells={cells} />
    </div>
  );
}

export function SiteOgCard({
  logoUrl,
  eyebrow,
  headline,
  subhead,
  cells,
}: {
  logoUrl: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  cells: OgCells;
}) {
  return (
    <OgInkCanvas logoUrl={logoUrl} eyebrow={eyebrow} cells={cells}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: "'Geist', sans-serif",
            fontSize: 88,
            fontWeight: 600,
            letterSpacing: '-0.045em',
            lineHeight: 0.92,
            textTransform: 'uppercase',
            color: '#fff',
          }}
        >
          {headline}
        </span>
        <span
          style={{
            fontFamily: "'Geist', sans-serif",
            fontSize: 88,
            fontWeight: 600,
            letterSpacing: '-0.045em',
            lineHeight: 0.92,
            textTransform: 'uppercase',
            color: MUTED_LINE,
          }}
        >
          {subhead}
        </span>
      </div>
    </OgInkCanvas>
  );
}

export function JobOgCard({
  logoUrl,
  headline,
  employer,
  pay,
  cells,
}: {
  logoUrl: string;
  headline: string;
  employer: string;
  pay: string;
  cells: OgCells;
}) {
  return (
    <OgInkCanvas logoUrl={logoUrl} eyebrow="Jobs" cells={cells}>
      <div
        style={{
          display: 'flex',
          fontFamily: "'Geist', sans-serif",
          fontSize: 56,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.12,
          color: '#fff',
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
          fontFamily: "'Geist Mono', monospace",
          fontSize: 22,
          fontWeight: 400,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: MUTED_META,
        }}
      >
        {employer}
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 18,
          fontFamily: "'Geist Mono', monospace",
          fontSize: 32,
          fontWeight: 500,
          letterSpacing: '0.02em',
          color: '#fff',
        }}
      >
        {pay}
      </div>
    </OgInkCanvas>
  );
}
