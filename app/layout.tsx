import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import {
  getMetadataBase,
  OG_SITE_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/lib/site';
import './globals.css';

/* Geist is the only family in the system — sans for body and display,
   mono for UI, metadata and numerics. Do not add a third.
   Spec: docs/brand-guidelines.md § Type */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Same assets as cowboytools.ca (storefront public/favicon.ico + icon-192.png).
  icons: {
    icon: [{ url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' }],
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: OG_SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-surface text-ink font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
