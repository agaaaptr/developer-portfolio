import './globals.css';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ScrollToTopButton />
      </body>
    </html>
  );
}