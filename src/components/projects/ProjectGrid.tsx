'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';

interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  tech: string[];
  image: string;
  github?: string;
  demo?: string;
  featured?: boolean;
  originalIndex: number;
}

interface ProjectGridProps {
  projects: Project[];
  filterKey?: string;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, filterKey = 'all' }) => {
  // Determine card sizes based on index for varied layout
  const getCardSize = (index: number): 'small' | 'medium' | 'large' => {
    // Create a varied pattern
    const pattern = [
      'large', 'medium', 'medium',
      'medium', 'large', 'small',
      'small', 'medium', 'large',
    ];
    return pattern[index % pattern.length] as 'small' | 'medium' | 'large';
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={filterKey}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            size={getCardSize(project.originalIndex)}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
