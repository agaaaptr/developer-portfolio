import React from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      whileHover={{ scale: 1.03, boxShadow: "0px 0px 20px rgba(168, 85, 247, 0.5)", cursor: "default" }}
      whileTap={isMobile ? {} : { scale: 0.98, cursor: "default" }}
      transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
      className={`flex flex-col justify-between items-center text-center bg-secondary-800 p-6 rounded-lg border border-secondary-700 cursor-default ${className}`}
    >
      {children}
    </motion.div>
  );
};