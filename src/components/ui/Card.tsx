import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
    whileHover={{ scale: 1.02, boxShadow: "0px 0px 20px rgba(76, 29, 149, 0.5)", cursor: "default", transition: { boxShadow: { duration: 0.1 } } }} // Subtle scale and primary color glow
    whileTap={{ scale: 0.98, cursor: "default" }}
    className={`flex flex-col justify-between items-center text-center bg-secondary-800 p-6 rounded-lg border border-secondary-700 cursor-default ${className}`}
  >
    {children}
  </motion.div>
);