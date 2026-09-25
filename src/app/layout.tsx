import './globals.css';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';
import { BodyWrapper } from '@/components/layout/BodyWrapper';
import personalData from '@/data/personal.json';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <title>{personalData.professionalName} · {personalData.title}</title>
      </head>
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