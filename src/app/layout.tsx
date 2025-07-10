import './globals.css';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton';
import { BackgroundManager } from '@/components/layout/BackgroundManager';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BackgroundManager />
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}