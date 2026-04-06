import './globals.css';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';
import { BodyWrapper } from '@/components/layout/BodyWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Developer Portfolio - Aga</title>
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