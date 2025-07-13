"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

export const Header: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary-900/80 backdrop-blur-md border-b border-secondary-700/50 py-4 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-2"
          whileHover="hover"
          initial="rest"
          animate="rest"
        >
          <motion.div
            variants={{
              rest: { scale: 1, rotate: 0 },
              hover: isMobile ? {} : { scale: 1.1, rotate: 10 },
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Code2 className="h-8 w-8 text-primary-400" />
          </motion.div>
          <span className="text-xl font-bold text-white">Portfolio</span>
        </motion.div>
        <Button
          onClick={() => window.open('/cv.pdf', '_blank')}
          className="bg-transparent border border-primary-400 text-primary-400 px-8 py-3 rounded-full font-semibold hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors"
        >
          Download CV
        </Button>
      </div>
    </header>
  );
};