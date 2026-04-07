"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useScrollDirection } from '@/lib/hooks/useScrollDirection';
import { useTheme } from '@/components/layout/ThemeProvider';

const navItems = [
  { id: 'home', label: 'home', num: '01' },
  { id: 'expertise', label: 'expertise', num: '02' },
  { id: 'work', label: 'work', num: '03' },
  { id: 'experience', label: 'experience', num: '04' },
  { id: 'contact', label: 'contact', num: '05' },
];

export const Header: React.FC = () => {
  const { isAtTop } = useScrollDirection({ threshold: 50 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Check if we're on a project page
  const isProjectPage = pathname?.startsWith('/project');
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  // When not at top, always show sticky compact header
  useEffect(() => {
    if (isAtTop) {
      setShowStickyHeader(false);
    } else {
      // Always show sticky header when not at top
      setShowStickyHeader(true);
    }
  }, [isAtTop]);

  const navigateToSection = (sectionId: string) => {
    if (isProjectPage) {
      // Navigate to home page with section hash
      router.push(`/#${sectionId}`);
    } else {
      // Scroll to section on current page
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  if (!mounted) {
    return null;
  }

  // On project pages, always show the sticky compact header (scroll style)
  if (isProjectPage) {
    return (
      <>
        {/* Sticky Compact Header for Project Pages - Scroll Style */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800/30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>

              {/* Centered Navigation - Desktop */}
              <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1 justify-center">
                {navItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => navigateToSection(item.id)}
                    className="relative text-gray-700 dark:text-gray-300 hover:text-accent-400 dark:hover:text-accent-400 transition-colors font-mono text-sm tracking-wide group"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                  >
                    <sup className="text-[10px] text-gray-500 dark:text-gray-500 group-hover:text-accent-400 transition-colors mr-0.5">{item.num}</sup>
                    <span className="text-accent-400/70">{'//'}</span> {item.label}
                  </motion.button>
                ))}
              </nav>

              {/* Theme Toggle - Mobile only */}
              <motion.button
                className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-accent-400 dark:hover:text-accent-400"
                onClick={toggleTheme}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Mobile Menu Overlay for Project Pages */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 md:hidden"
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-white/95 dark:bg-dark-900/95 backdrop-blur-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Menu Content */}
              <motion.nav
                className="relative flex flex-col items-center justify-center h-full space-y-6 sm:space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.1 }}
              >
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => navigateToSection(item.id)}
                    className="text-xl sm:text-2xl font-mono text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.05 * index }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <sup className="text-xs text-gray-500 dark:text-gray-500 mr-1">{item.num}</sup>
                    <span className="text-accent-400">{'//'}</span> {item.label}
                  </motion.button>
                ))}
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Default header for main page
  return (
    <>
      {/* Main Header - visible at top */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: isAtTop ? 0 : -100 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.button
              onClick={() => navigateToSection('home')}
              className="flex items-center space-x-1 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
            >
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                AgaPutra
              </span>
              <motion.span
                className="text-accent-400 text-xl md:text-2xl font-bold"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                ._
              </motion.span>
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => navigateToSection(item.id)}
                  className="relative text-gray-300 hover:text-accent-400 transition-colors font-mono text-sm tracking-wide group"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                >
                  <sup className="text-[10px] text-gray-500 group-hover:text-accent-400 transition-colors mr-0.5">{item.num}</sup>
                  <span className="text-accent-400/70">{'//'}</span> {item.label}
                </motion.button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Sticky Compact Header - visible when scrolling up */}
      <AnimatePresence>
        {showStickyHeader && !isAtTop && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-md border-b border-gray-800/30"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center h-14">
                {/* Centered Navigation - no logo */}
                <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => navigateToSection(item.id)}
                      className="relative text-gray-300 hover:text-accent-400 transition-colors font-mono text-sm tracking-wide group"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                    >
                      <sup className="text-[10px] text-gray-500 group-hover:text-accent-400 transition-colors mr-0.5">{item.num}</sup>
                      <span className="text-accent-400/70">{'//'}</span> {item.label}
                    </motion.button>
                  ))}
                </nav>

                {/* Mobile Menu Button */}
                <motion.button
                  className="md:hidden p-2 text-gray-300 hover:text-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  whileTap={{ scale: 0.9 }}
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-dark-900/95 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.nav
              className="relative flex flex-col items-center justify-center h-full space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => navigateToSection(item.id)}
                  className="text-2xl font-mono text-gray-300 hover:text-white transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.05 * index }}
                  whileTap={{ scale: 0.95 }}
                >
                  <sup className="text-xs text-gray-500 mr-1">{item.num}</sup>
                  <span className="text-accent-400">{'//'}</span> {item.label}
                </motion.button>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};