'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeOut" } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-900"
        >
          <motion.div
            className="relative w-24 h-24 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Outer Square */}
            <motion.div
              className="absolute w-full h-full border-4 border-primary-400 rounded-lg"
              animate={{
                rotate: [0, 90, 180, 270, 360],
                opacity: [0.5, 1, 0.5, 1, 0.5],
                scale: [0.8, 1, 0.8, 1, 0.8]
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop"
              }}
            />

            {/* Middle Square */}
            <motion.div
              className="absolute w-3/4 h-3/4 border-4 border-accent-400 rounded-lg"
              animate={{
                rotate: [360, 270, 180, 90, 0],
                opacity: [0.7, 0.5, 1, 0.5, 0.7],
                scale: [1, 0.8, 1, 0.8, 1]
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.5
              }}
            />

            {/* Inner Square */}
            <motion.div
              className="absolute w-1/2 h-1/2 bg-primary-500 rounded-lg"
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                delay: 1
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
