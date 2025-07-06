import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import personalData from '@/data/personal.json';

export const HeroSection: React.FC = () => (
  <section className="min-h-screen flex items-center justify-center pt-16 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-white"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
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
          className="text-lg text-secondary-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {personalData.subtitle}
        </motion.p>

        <motion.div
          className="flex items-center justify-center space-x-6 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Get In Touch
          </motion.a>
          
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-secondary-600 text-secondary-300 px-8 py-3 rounded-lg font-semibold hover:bg-secondary-800 transition-all duration-300"
          >
            View Projects
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6 text-secondary-400" />
      </motion.div>
    </div>
  </section>
);