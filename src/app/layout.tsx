import type { Metadata } from 'next';
import { Cormorant_Garamond, Italiana } from 'next/font/google';
import NavBar from '@/components/layout/NavBar';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const italiana = Italiana({
  variable: '--font-display-var',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Envisioned Systems',
  description:
    'Owned, agent-native digital infrastructure for consultants and personal brands. Your website, content engine, CRM, and operator — on your own foundations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${italiana.variable} antialiased`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
