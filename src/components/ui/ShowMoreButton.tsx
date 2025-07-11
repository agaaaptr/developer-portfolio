import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ShowMoreButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

export const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({ isExpanded, onClick }) => (
  <motion.button
    layout
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{
      layout: { duration: 0.3, ease: "easeInOut", delay: 0.4 },
      scale: { duration: 0.1 }
    }}
    className="px-6 py-3 bg-secondary-700 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-secondary-600 transition-colors shadow-lg"
  >
    <motion.div
      initial={false}
      animate={{ rotate: isExpanded ? 180 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {isExpanded ? (
        <ChevronUp className="h-5 w-5" />
      ) : (
        <ChevronDown className="h-5 w-5" />
      )}
    </motion.div>
    <motion.span
      layout
      key={isExpanded ? 'less' : 'more'}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {isExpanded ? 'Show Less' : 'Show More'}
    </motion.span>
  </motion.button>
);