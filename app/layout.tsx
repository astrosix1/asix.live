import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'asixstud.io | A Hub for Innovative Webapps',
  description: 'Discover innovative webapps including Ascend, GeoIntel, and Heavy Pocket',
  keywords: 'webapps, projects, portfolio, innovation',
  authors: [{ name: 'asixstud' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-50">
        <Navigation />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
