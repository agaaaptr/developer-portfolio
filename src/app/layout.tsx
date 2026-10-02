import type { Metadata } from 'next';
import './globals.css';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';
import { BodyWrapper } from '@/components/layout/BodyWrapper';
import personalData from '@/data/personal.json';

export const metadata: Metadata = {
  title: `${personalData.professionalName} · ${personalData.title}`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <BodyWrapper>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </BodyWrapper>
      </body>
    </html>
  );
}