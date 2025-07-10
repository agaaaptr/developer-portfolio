import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <motion.div
    whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className={`flex flex-col justify-between items-center text-center bg-secondary-800 p-6 rounded-lg border border-secondary-700 ${className}`}
  >
    {children}
  </motion.div>
);