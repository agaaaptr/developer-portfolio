import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", type = "button" }) => (
  <motion.button
    type={type}
    onClick={onClick}
    whileHover={{ scale: 1.08, boxShadow: "0 0 30px rgba(168, 85, 247, 0.5)" }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
    className={`px-4 py-2 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-400 hover:text-white transition-colors ${className}`}
  >
    {children}
  </motion.button>
);