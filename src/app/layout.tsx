import type { Metadata } from 'next';
import { Inter, Courier_Prime } from 'next/font/google';
import NavBar from '@/components/layout/NavBar';
import './globals.css';

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
});

const courierPrime = Courier_Prime({
  variable: '--font-kicker',
  subsets: ['latin'],
  weight: ['400', '700'],
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
      <body className={`${inter.variable} ${courierPrime.variable} antialiased`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
