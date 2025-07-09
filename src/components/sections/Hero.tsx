import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import personalData from '@/data/personal.json';

export const HeroSection: React.FC = () => (
  <section className="relative min-h-screen flex items-center justify-center bg-secondary-900 text-white pt-16 px-4 overflow-hidden">
    {/* Subtle Radial Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900" />
    <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, rgba(100, 100, 100, 0.05) 0%, transparent 70%)' }} />
    
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
            {personalData.name}
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-secondary-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {personalData.title}
        </motion.p>
        
        <motion.p 
          className="max-w-2xl mx-auto text-lg text-secondary-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {personalData.subtitle}
        </motion.p>

        <motion.div
          className="flex items-center justify-center flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(192, 38, 211, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-accent-600 to-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2 group"
          >
            <span>Get In Touch</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05, borderColor: 'rgba(148, 163, 184, 0.7)' }}
            whileTap={{ scale: 0.95 }}
            className="border border-secondary-600 text-secondary-300 px-8 py-3 rounded-full font-semibold hover:bg-secondary-800 hover:text-white transition-all duration-300"
          >
            View My Work
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6 text-secondary-500" />
      </motion.div>
    </div>
  </section>
);