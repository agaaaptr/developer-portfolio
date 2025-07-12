import React from 'react';
import { motion } from 'framer-motion';

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientCard: React.FC<GradientCardProps> = ({ children, className = "" }) => (
  <motion.div
    whileHover={{ 
      scale: 1.02, 
      boxShadow: "0px 0px 20px rgba(76, 29, 149, 0.5)", 
      cursor: "default",
      transition: { boxShadow: { duration: 0.1 } } 
    }}
    whileTap={{ scale: 0.98, cursor: "default" }}
    transition={{ 
      type: "spring", 
      stiffness: 800, 
      damping: 15
    }}
    className={`w-full bg-gradient-to-br from-secondary-800/50 to-secondary-900/50 backdrop-blur-sm border border-secondary-700/50 rounded-2xl p-6 transition-all duration-300 cursor-default ${className}`}
  >
    {children}
  </motion.div>
);