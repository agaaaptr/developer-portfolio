import React from 'react';
import { motion } from 'framer-motion';

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientCard: React.FC<GradientCardProps> = ({ children, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
    className={`bg-gradient-to-br from-secondary-800/50 to-secondary-900/50 backdrop-blur-sm border border-secondary-700/50 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);