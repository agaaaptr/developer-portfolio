"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSectionTracker } from '@/lib/hooks/useSectionTracker';

export const ReturnToPreviousSectionButton: React.FC = () => {
  const { previousSection, scrollToSection } = useSectionTracker();

  return (
    <AnimatePresence>
      {previousSection && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-24 right-8 z-40"
        >
          <Button
            onClick={() => scrollToSection(previousSection.id)}
            className="px-3 py-2 text-sm bg-secondary-800 text-white rounded-full font-semibold shadow-lg hover:bg-secondary-700 transition-colors flex items-center space-x-1 md:px-4 md:py-2 md:text-base md:space-x-2"
            aria-label={`Return to ${previousSection.name} section`}
          >
            <ArrowUp className="h-4 w-4" />
            <span className="hidden md:inline">Return to {previousSection.name}</span>
            <span className="inline md:hidden">{previousSection.name}</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};