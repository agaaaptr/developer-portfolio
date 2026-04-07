'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
}

interface ProjectGridProps {
  projects: Project[];
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects }) => {
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
    <AnimatePresence mode="wait">
      <motion.div
        key={projects.map(p => p.id).join('-')}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            size={getCardSize(index)}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
