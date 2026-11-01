import { Header } from '@/components/layout/Header';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton';
import { SmoothScroll } from '@/components/layout/SmoothScroll';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <Header />
      {children}
      <ScrollToTopButton />
    </SmoothScroll>
  );
}
