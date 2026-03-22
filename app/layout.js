import './globals.css';
import { DM_Sans, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-cormorant' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-mono' });

export const metadata = {
  title: 'Kuralara WebFlux - Engineering-Focused Software Studio',
  description: 'Kuralara WebFlux is an engineering-driven software studio. MERN stack, clean architecture, scalable systems.',
  // FORCE CUSTOM FAVICON
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  alternates: {
    canonical: 'https://kuralarawebflux.com',
  },
  openGraph: {
    title: 'Kuralara WebFlux',
    description: 'Engineering-driven software studio in Tamil Nadu.',
    url: 'https://kuralarawebflux.com',
    siteName: 'Kuralara WebFlux',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={`${dmSans.variable} ${cormorant.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}