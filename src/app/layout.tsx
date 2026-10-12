import type { Metadata } from 'next';
import { Archivo_Black, Space_Grotesk, JetBrains_Mono, Caveat } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import personalData from '@/data/personal.json';

const displayFont = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo-black',
  display: 'swap',
});

const bodyFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const handFont = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-caveat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${personalData.professionalName} · ${personalData.title}`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} ${handFont.variable}`}
    >
      <body>
        <SmoothScroll>
          <Header />
          {children}
          <ScrollToTopButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
