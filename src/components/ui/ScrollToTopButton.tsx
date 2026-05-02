"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const isProjectPage = pathname?.startsWith('/project');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 500);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // On project pages (mobile), position above the bottom navigation bar
  // On main page, use normal positioning
  const positionClasses = isProjectPage
    ? 'bottom-20 md:bottom-8 right-3 sm:right-6'
    : 'bottom-4 sm:bottom-8 right-3 sm:right-6';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
          onClick={scrollToTop}
          className={`fixed ${positionClasses} p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl backdrop-blur-md border transition-colors z-50 flex items-center justify-center ${
            isDark
              ? 'bg-dark-900/50 border-accent-500/30 text-accent-300 shadow-[0_14px_35px_rgba(10,10,18,0.25)] hover:text-white hover:border-accent-400 hover:bg-accent-500/20'
              : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:text-accent-700 hover:border-accent-400 hover:bg-accent-50'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5 transition-colors" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
