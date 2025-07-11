import './globals.css';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Developer Portfolio - Aga</title>
      </head>
      <RootLayoutClient>
        {children}
      </RootLayoutClient>
    </html>
  );
}