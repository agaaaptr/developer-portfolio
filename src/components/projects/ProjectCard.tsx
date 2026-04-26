'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

// Simple SVG icon for GitHub
const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  tech: string[];
  image: string;
  role?: string;
  github?: string;
  demo?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  size?: 'small' | 'medium' | 'large';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  index,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'min-h-[280px]',
    medium: 'min-h-[320px]',
    large: 'min-h-[380px]',
  };

  const categoryLabels: Record<string, string> = {
    web: 'Web Development',
    mobile: 'Mobile Development',
  };

  interface ProjectWithSubCategories extends Project {
    subCategories?: string[];
  }

  const projectWithSub = project as ProjectWithSubCategories;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        duration: 0.6, 
        delay: 0.15 + index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`${sizeClasses[size]}`}
    >
      <motion.div
        className="relative h-full rounded-2xl bg-dark-400/50 border border-gray-700/50 overflow-hidden group cursor-pointer"
        whileHover={{ 
          y: -8,
          borderColor: 'rgba(168, 85, 247, 0.4)',
        }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
      >
        {/* Image or Placeholder */}
        <div className="relative h-40 md:h-48 bg-dark-300/50 overflow-hidden">
          <ImageWithFallback
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            isDark={true}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-400/90 via-dark-400/20 to-transparent" />
          
          {/* Category badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-mono text-accent-400 bg-dark-900/80 backdrop-blur-sm rounded-full border border-accent-500/20">
              {categoryLabels[project.category] || project.category}
            </span>
            {/* Sub category badges */}
            {projectWithSub.subCategories?.map((subCat, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-[10px] font-medium text-white bg-gray-700/60 backdrop-blur-sm rounded-full border border-gray-600/40"
              >
                {subCat}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-accent-400 transition-colors">
            {project.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {project.shortDescription}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs text-gray-500 bg-dark-300/50 rounded"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-gray-600">
                +{project.tech.length - 4}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
            <Link
              href={`/project/${project.slug}`}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent-400 transition-colors group/link"
            >
              <span>Show project</span>
              <motion.span
                className="inline-block"
                initial={{ x: 0 }}
                whileHover={{ x: 6 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
              >
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </motion.span>
            </Link>

            <div className="flex items-center gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GithubIcon />
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-navy-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};
