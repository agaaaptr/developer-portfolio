"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import personalData from '@/data/personal.json';
import { useSectionTracker } from '@/lib/hooks/useSectionTracker';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

export const HeroSection: React.FC = () => {
  const { scrollToSection } = useSectionTracker();
  const isMobile = useMediaQuery('(max-width: 768px)'); // Adjust breakpoint as needed

  const initialY = isMobile ? 10 : 30;
  const duration = isMobile ? 0.5 : 0.8;

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-primary-900 to-secondary-900 animate-background-pan"
        style={{ backgroundSize: '200% 200%' }}
      />

      {/* Blob Animation */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: initialY }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration, ease: "easeOut" }}
          className="space-y-6"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.5 }}
          >
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent drop-shadow-lg animate-text-glow">
              {personalData.name}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl font-normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.7 }}
          >
            <span className="text-white drop-shadow-lg" style={{ textShadow: '0 0 5px rgba(255,255,255,0.5), 0 0 10px rgba(255,255,255,0.3)' }}>
              {personalData.title}
            </span>
          </motion.p>
          
          <motion.p 
            className="max-w-2xl mx-auto text-lg font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.9 }}
          >
            <span className="text-white drop-shadow-lg" style={{ textShadow: '0 0 5px rgba(255,255,255,0.5), 0 0 10px rgba(255,255,255,0.3)' }}>
              {personalData.subtitle}
            </span>
          </motion.p>

          <motion.div
            className="flex items-center justify-center flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 100, delay: 1.1 }}
          >
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-500 flex items-center justify-center space-x-2 group shadow-lg w-48"
            >
              <span>Get In Touch</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              onClick={() => scrollToSection('projects')}
              className="bg-transparent border border-primary-400 text-primary-400 px-8 py-3 rounded-full font-semibold hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors flex items-center justify-center w-48"
            >
              View My Work
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-10 inset-x-0 mx-auto w-fit"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 10, stiffness: 100, delay: 1.3 }}
      >
        <motion.div
          animate={{ y: [0, isMobile ? 5 : 10, 0] }}
          transition={{ duration: isMobile ? 1.5 : 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <a href="#about" aria-label="Scroll to next section">
            <ChevronDown className="h-8 w-8 text-secondary-500 hover:text-white transition-colors" />
          </a>
        </motion.div>
      </motion.div>
      
      {/* Seamless bottom edge */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-secondary-900 to-transparent" />
    </section>
  );
};
