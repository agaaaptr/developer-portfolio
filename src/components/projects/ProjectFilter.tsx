'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type ProjectCategory = 'all' | 'web' | 'mobile';

interface FilterOption {
  id: ProjectCategory;
  label: string;
  count: number;
}

interface ProjectFilterProps {
  options: FilterOption[];
  activeFilter: ProjectCategory;
  onFilterChange: (filter: ProjectCategory) => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  options,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <motion.div
      className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-4 mb-8 sm:mb-10 md:mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Filter by label */}
      <motion.span
        className="text-gray-500 text-xs sm:text-sm font-mono mr-1 sm:mr-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        Filter by
      </motion.span>
      
      {options.map((option, index) => (
        <motion.button
          key={option.id}
          onClick={() => onFilterChange(option.id)}
          className={`relative px-2 sm:px-3 py-1 sm:py-1.5 font-mono text-xs sm:text-sm transition-colors ${
            activeFilter === option.id
              ? 'text-accent-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            opacity: { duration: 0.6, delay: 0.4 + index * 0.1 },
            y: { type: "spring", stiffness: 300, damping: 25 },
            scale: { type: "spring", stiffness: 300, damping: 25 }
          }}
        >
          <span className="hidden sm:inline">{option.label}</span>
          <span className="sm:hidden">{option.id === 'all' ? 'All' : option.id === 'web' ? 'Web' : 'Mobile'}</span>
          <sup className="ml-0.5 sm:ml-1 text-[10px] sm:text-xs opacity-70">
            {option.count.toString().padStart(2, '0')}
          </sup>
          
          {/* Separator slash */}
          {index < options.length - 1 && (
            <span className="absolute -right-1 sm:-right-2 md:-right-3 text-gray-600">/</span>
          )}
          
          {/* Active indicator */}
          {activeFilter === option.id && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-400"
              layoutId="activeFilter"
              transition={{ type: 'spring' as const, stiffness: 400, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};
