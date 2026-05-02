'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';

export const ThemeSlider: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden md:block"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className={`flex flex-col items-center gap-2 p-3 rounded-2xl backdrop-blur-md border ${
        isDark 
          ? 'bg-dark-400/95 border-gray-700/50' 
          : 'bg-white/95 border-gray-200'
      }`}>
        {/* Dark mode button */}
        <motion.button
          onClick={() => !isDark && toggleTheme()}
          disabled={isDark}
          className={`p-2.5 rounded-xl border transition-colors duration-150 disabled:cursor-default ${
            isDark 
              ? 'bg-accent-500/20 text-accent-400 border-accent-500/30 shadow-sm' 
              : 'text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-200 hover:bg-gray-100'
          }`}
          whileHover={isDark ? undefined : { scale: 1.05 }}
          whileTap={isDark ? undefined : { scale: 0.96 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          aria-label="Dark mode"
          aria-pressed={isDark}
        >
          <Moon className="w-4 h-4" />
        </motion.button>

        {/* Divider with slider indicator */}
        <div className={`relative w-1 h-8 rounded-full overflow-hidden ${
          isDark ? 'bg-dark-300/50' : 'bg-gray-200'
        }`}>
          <motion.div
            className="absolute left-0 right-0 h-4 rounded-full bg-accent-400"
            animate={{ top: isDark ? 0 : 16 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
          />
        </div>

        {/* Light mode button */}
        <motion.button
          onClick={() => isDark && toggleTheme()}
          disabled={!isDark}
          className={`p-2.5 rounded-xl border transition-colors duration-150 disabled:cursor-default ${
            !isDark 
              ? 'bg-accent-500/20 text-accent-500 border-accent-500/30 shadow-sm' 
              : 'text-gray-500 border-transparent hover:text-gray-300 hover:border-gray-700/50 hover:bg-dark-300/50'
          }`}
          whileHover={isDark ? { scale: 1.05 } : undefined}
          whileTap={isDark ? { scale: 0.96 } : undefined}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          aria-label="Light mode"
          aria-pressed={!isDark}
        >
          <Sun className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};
