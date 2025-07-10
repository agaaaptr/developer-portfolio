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
    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)" }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className={`px-4 py-2 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-400 hover:text-white transition-colors ${className}`}
  >
    {children}
  </motion.button>
);