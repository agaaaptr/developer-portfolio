import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ShowMoreButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

export const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({ isExpanded, onClick }) => (
  <Button
    onClick={onClick}
    className="px-6 py-3 bg-secondary-800 text-white rounded-full flex items-center justify-center space-x-2 hover:bg-secondary-700 transition-colors shadow-lg"
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
  </Button>
);