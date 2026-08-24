import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
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
  title: 'Tradesboard',
  description: 'Jobs and employers in the skilled trades.',
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
