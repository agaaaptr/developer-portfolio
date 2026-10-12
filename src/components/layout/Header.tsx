"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import personalData from '@/data/personal.json';

const navItems = [
  { id: 'home', label: 'home', num: '01' },
  { id: 'expertise', label: 'expertise', num: '02' },
  { id: 'work', label: 'work', num: '03' },
  { id: 'experience', label: 'experience', num: '04' },
  { id: 'contact', label: 'contact', num: '05' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const router = useRouter();
  const isProjectPage = pathname?.startsWith('/project');

  useEffect(() => {
    if (isProjectPage) return;

    const onScroll = () => {
      const probe = window.scrollY + window.innerHeight * 0.35;
      let current = 'home';
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= probe) {
          current = item.id;
        }
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isProjectPage]);

  const navigateToSection = (sectionId: string) => {
    if (isProjectPage) {
      router.push(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav className="flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border-2 border-ink bg-card px-4 py-2 shadow-neo">
          <button
            onClick={() => navigateToSection('home')}
            className="flex items-center gap-1 font-display text-sm uppercase tracking-wide"
          >
            AgaPutra<span className="text-violet">._</span>
          </button>

          <div className="hidden items-center gap-4 lg:flex">
            {navItems.map((item) => {
              const isActive = activeSection === item.id && !isProjectPage;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateToSection(item.id)}
                  className={`relative flex items-baseline gap-1 rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wide transition-all ${
                    isActive ? 'bg-ink text-card' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  <sup className={`text-[9px] ${isActive ? 'text-lime' : 'text-ink/40'}`}>{item.num}</sup>
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${personalData.email}`}
              className="hidden rounded-full border-2 border-ink bg-lime px-4 py-1.5 font-display text-xs uppercase tracking-wide text-ink shadow-neo transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none sm:block"
            >
              Hire me
            </a>
            <button
              className="rounded-full border-2 border-ink p-2 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-surface/95"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav className="relative flex h-full flex-col items-center justify-center gap-6">
              {navItems.map((item, i) => {
                const isActive = activeSection === item.id && !isProjectPage;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => navigateToSection(item.id)}
                    className={`flex items-baseline gap-2 rounded-full px-4 py-1 font-display text-3xl uppercase ${
                      isActive ? 'bg-ink text-card' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <sup className={`font-mono text-xs ${isActive ? 'text-lime' : 'text-violet'}`}>{item.num}</sup>
                    {item.label}
                  </motion.button>
                );
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
