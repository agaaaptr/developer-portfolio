import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <motion.div
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className={`flex flex-col justify-between items-center text-center bg-secondary-800 p-6 rounded-lg border border-secondary-700 ${className}`}
  >
    {children}
  </motion.div>
);