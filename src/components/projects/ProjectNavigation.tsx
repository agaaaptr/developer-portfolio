'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/components/layout/ThemeProvider';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface Project {
  slug: string;
  title: string;
  image?: string;
}

interface ProjectNavigationProps {
  prevProject: Project | null;
  nextProject: Project | null;
}

export const ProjectNavigation: React.FC<ProjectNavigationProps> = ({
  prevProject,
  nextProject,
}) => {
  const [hoveredProject, setHoveredProject] = useState<'prev' | 'next' | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!nextProject && !prevProject) return null;

  // Show next project by default, or prev if no next
  const defaultProject = nextProject || prevProject;
  
  // When hovering, show the hovered project's image
  const hoveredProjectData = hoveredProject === 'prev' ? prevProject : hoveredProject === 'next' ? nextProject : null;
  const showImageOnHover = hoveredProjectData !== null;

  return (
    <>
      {/* Mobile version - simple bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className={`flex items-center justify-between px-4 py-3 backdrop-blur-md border-t ${
          isDark 
            ? 'bg-dark-900/95 border-accent-500/20' 
            : 'bg-white/95 border-accent-500/20'
        }`}>
          {prevProject ? (
            <Link href={`/project/${prevProject.slug}`} className="flex-1">
              <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                isDark ? 'text-accent-300 active:bg-accent-500/20' : 'text-accent-600 active:bg-accent-500/10'
              }`}>
                <ChevronLeft className="w-5 h-5" />
                <div className="min-w-0">
                  <p className="text-xs opacity-70">Previous</p>
                  <p className="text-sm font-medium truncate">{prevProject.title}</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          
          {nextProject ? (
            <Link href={`/project/${nextProject.slug}`} className="flex-1">
              <div className={`flex items-center justify-end gap-2 p-2 rounded-lg transition-colors ${
                isDark ? 'text-accent-300 active:bg-accent-500/20' : 'text-accent-600 active:bg-accent-500/10'
              }`}>
                <div className="min-w-0 text-right">
                  <p className="text-xs opacity-70">Next</p>
                  <p className="text-sm font-medium truncate">{nextProject.title}</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>

      {/* Desktop version - floating card */}
      <motion.div
        className="hidden md:block fixed bottom-16 lg:bottom-24 right-3 lg:right-6 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className={`flex flex-col items-end gap-0 p-3 lg:p-4 rounded-xl lg:rounded-2xl backdrop-blur-md border ${
            isDark 
              ? 'bg-accent-500/20 border-accent-500/40' 
              : 'bg-accent-500/10 border-accent-500/30'
          }`}
          style={{ width: 220 }}
        >
          {/* Project image - only visible on hover (desktop only) */}
          <AnimatePresence>
            {showImageOnHover && (
              <motion.div
                key="project-image-container"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 120, marginBottom: 12 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ 
                  type: "tween",
                  duration: 0.25,
                  ease: "easeOut"
                }}
                className="w-full overflow-hidden"
              >
                <motion.div 
                  className={`relative w-full h-full rounded-lg lg:rounded-xl overflow-hidden ${
                    isDark ? 'bg-dark-300/50' : 'bg-gray-100'
                  }`}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    type: "tween",
                    duration: 0.3,
                    ease: "easeOut",
                    delay: 0.05
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={hoveredProjectData?.slug || 'empty'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0"
                    >
                      <ImageWithFallback
                        src={hoveredProjectData?.image || ''}
                        alt={hoveredProjectData?.title || 'Project'}
                        fill
                        sizes="220px"
                        className="object-cover"
                        isDark={isDark}
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Project info - always visible */}
          <div className="w-full mb-2 lg:mb-3">
            <p className={`text-xs mb-0.5 lg:mb-1 ${isDark ? 'text-accent-300/70' : 'text-accent-600/70'}`}>
              {hoveredProject === 'prev' ? 'Previous Project' : 'Next Project'}
            </p>
            <p className={`font-medium truncate text-xs lg:text-sm ${isDark ? 'text-white' : 'text-dark-900'}`}>
              {hoveredProject === 'prev' && prevProject 
                ? prevProject.title 
                : hoveredProject === 'next' && nextProject 
                  ? nextProject.title 
                  : defaultProject?.title}
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-1.5 lg:gap-2 w-full justify-end">
            {prevProject ? (
              <Link href={`/project/${prevProject.slug}`}>
                <button
                  className={`p-2 lg:p-3 rounded-lg lg:rounded-xl border transition-all duration-200 ${
                    isDark 
                      ? 'bg-dark-900/50 border-accent-500/30 text-accent-300 hover:text-white hover:border-accent-400 hover:bg-accent-500/20' 
                      : 'bg-white/50 border-accent-500/30 text-accent-600 hover:text-accent-700 hover:border-accent-500 hover:bg-accent-500/10'
                  }`}
                  aria-label="Previous project"
                  onMouseEnter={() => setHoveredProject('prev')}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </Link>
            ) : (
              <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl border cursor-not-allowed ${
                isDark 
                  ? 'bg-dark-900/30 border-gray-800/30 text-gray-600' 
                  : 'bg-gray-100/50 border-gray-200 text-gray-400'
              }`}>
                <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
            )}

            {nextProject ? (
              <Link href={`/project/${nextProject.slug}`}>
                <button
                  className={`p-2 lg:p-3 rounded-lg lg:rounded-xl border transition-all duration-200 ${
                    isDark 
                      ? 'bg-dark-900/50 border-accent-500/30 text-accent-300 hover:text-white hover:border-accent-400 hover:bg-accent-500/20' 
                      : 'bg-white/50 border-accent-500/30 text-accent-600 hover:text-accent-700 hover:border-accent-500 hover:bg-accent-500/10'
                  }`}
                  aria-label="Next project"
                  onMouseEnter={() => setHoveredProject('next')}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </Link>
            ) : (
              <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl border cursor-not-allowed ${
                isDark 
                  ? 'bg-dark-900/30 border-gray-800/30 text-gray-600' 
                  : 'bg-gray-100/50 border-gray-200 text-gray-400'
              }`}>
                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};
