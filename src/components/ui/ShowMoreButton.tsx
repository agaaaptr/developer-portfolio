import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ShowMoreButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

export const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({ isExpanded, onClick }) => (
  <motion.button
    layoutId="showMoreButton"
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="mt-4 px-4 py-2 bg-secondary-700 text-white rounded-md flex items-center justify-center space-x-2 hover:bg-secondary-600 transition-colors"
  >
    {isExpanded ? (
      <>
        <ChevronUp className="h-5 w-5" />
        <motion.span layout>Show Less</motion.span>
      </>
    ) : (
      <>
        <ChevronDown className="h-5 w-5" />
        <motion.span layout>Show More</motion.span>
      </>
    )}
  </motion.button>
);