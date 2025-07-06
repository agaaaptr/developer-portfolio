/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';
import personalData from '@/data/personal.json';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export const ContactSection: React.FC = () => (
  <AnimatedSection className="py-20 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-8">
        <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          Let's Connect
        </span>
      </h2>
      
      <p className="text-xl text-secondary-300 mb-12">
        Always open to discussing new opportunities and interesting projects.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <motion.a
          href={`mailto:${personalData.email}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center space-x-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        >
          <Mail className="h-5 w-5" />
          <span>Send Email</span>
        </motion.a>
        
        <div className="flex space-x-4 justify-center">
          <motion.a
            href="#"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 bg-secondary-800 hover:bg-secondary-700 rounded-lg transition-colors"
          >
            <Linkedin className="h-6 w-6 text-secondary-300 hover:text-primary-400" />
          </motion.a>
          
          <motion.a
            href="#"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 bg-secondary-800 hover:bg-secondary-700 rounded-lg transition-colors"
          >
            <Github className="h-6 w-6 text-secondary-300 hover:text-primary-400" />
          </motion.a>
        </div>
      </div>
    </div>
  </AnimatedSection>
);