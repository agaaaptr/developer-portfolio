'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/components/layout/ThemeProvider';

interface ProjectBackButtonProps {
  className?: string;
}

export const ProjectBackButton: React.FC<ProjectBackButtonProps> = ({ className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Link href="/#work">
      <motion.button
        className={`fixed top-20 sm:top-24 left-3 sm:left-6 z-40 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl backdrop-blur-md border transition-colors ${
          isDark 
            ? 'bg-accent-500/20 border-accent-500/40 text-accent-300 hover:text-white hover:bg-accent-500/30 hover:border-accent-500/60' 
            : 'bg-accent-500/10 border-accent-500/30 text-accent-600 hover:text-accent-700 hover:bg-accent-500/20 hover:border-accent-500/50'
        } ${className}`}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
        aria-label="Back to Portfolio"
      >
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-xs sm:text-sm font-medium">Portfolio</span>
      </motion.button>
    </Link>
  );
};
