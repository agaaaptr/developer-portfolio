'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollIndicatorProps {
  onClick?: () => void;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={handleClick}
          className="flex flex-col items-center gap-3 cursor-pointer group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          aria-label="Scroll down"
        >
          {/* Oval Container with scrolling dot */}
          <motion.div
            className="relative w-7 h-12 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Oval Border - Animated Drawing */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 28 48"
              fill="none"
            >
              <motion.rect
                x="1.5"
                y="1.5"
                width="25"
                height="45"
                rx="12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-gray-600 group-hover:text-accent-400 transition-colors duration-300"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={hasAnimated ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ 
                  pathLength: { duration: 1.2, ease: "easeInOut" },
                  opacity: { duration: 0.3 }
                }}
              />
            </svg>

            {/* Scrolling Dot - stays inside oval, no overlap */}
            <motion.div
              className="absolute w-2 h-2 bg-accent-400 rounded-full left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, top: '20%' }}
              animate={hasAnimated ? {
                opacity: [0, 1, 1, 0],
                top: ['20%', '20%', '65%', '65%'],
              } : {}}
              transition={{
                duration: 2,
                delay: 0.6,
                repeat: Infinity,
                repeatDelay: 0.5,
                times: [0, 0.15, 0.85, 1],
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Arrow below oval - separate, no overlap */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.3 }}
          >
            <motion.svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              className="text-gray-500 group-hover:text-accent-400 transition-colors duration-300"
              animate={{ y: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <path
                d="M1 1L8 8L15 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>

          {/* Scroll Text */}
          <motion.span
            className="text-[10px] text-gray-500 font-mono tracking-widest uppercase group-hover:text-accent-400 transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.5, duration: 0.3 }}
          >
            Scroll
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
