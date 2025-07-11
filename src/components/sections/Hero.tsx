"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import personalData from '@/data/personal.json';
import { useSectionTracker } from '@/lib/hooks/useSectionTracker';

export const HeroSection: React.FC = () => {
  const { scrollToSection } = useSectionTracker();

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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent drop-shadow-lg animate-text-glow">
              {personalData.name}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-secondary-200 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {personalData.title}
          </motion.p>
          
          <motion.p 
            className="max-w-2xl mx-auto text-lg text-secondary-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {personalData.subtitle}
          </motion.p>

          <motion.div
            className="flex items-center justify-center flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-500 flex items-center space-x-2 group shadow-lg"
            >
              <span>Get In Touch</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              onClick={() => scrollToSection('projects')}
              className="bg-transparent border border-primary-400 text-primary-400 px-8 py-3 rounded-full font-semibold hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors"
            >
              View My Work
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
