'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
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

export const ProjectNavigation: React.FC<ProjectNavigationProps> = ({ prevProject, nextProject }) => {
  const [hoveredProject, setHoveredProject] = useState<'prev' | 'next' | null>(null);

  if (!nextProject && !prevProject) return null;

  const defaultProject = nextProject || prevProject;
  const activeProjectLabel =
    hoveredProject === 'prev'
      ? 'Previous Project'
      : hoveredProject === 'next'
        ? 'Next Project'
        : nextProject
          ? 'Next Project'
          : 'Previous Project';

  const hoveredProjectData =
    hoveredProject === 'prev' ? prevProject : hoveredProject === 'next' ? nextProject : null;
  const showImageOnHover = hoveredProjectData !== null;

  return (
    <>
      <div className="relative z-20 mx-auto max-w-6xl px-4 pt-4 lg:hidden">
        <div className={`grid gap-3 ${prevProject && nextProject ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
          {prevProject && (
            <Link
              href={`/project/${prevProject.slug}`}
              className="flex items-center gap-3 rounded-base border-2 border-ink bg-card px-4 py-3 shadow-neo"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-base border-2 border-ink bg-lime">
                <ChevronLeft className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-wide text-ink/50">Previous Project</p>
                <p className="truncate font-body text-sm font-bold">{prevProject.title}</p>
              </div>
            </Link>
          )}
          {nextProject && (
            <Link
              href={`/project/${nextProject.slug}`}
              className="flex items-center justify-between gap-3 rounded-base border-2 border-ink bg-card px-4 py-3 shadow-neo"
            >
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-wide text-ink/50">Next Project</p>
                <p className="truncate font-body text-sm font-bold">{nextProject.title}</p>
              </div>
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-base border-2 border-ink bg-lime">
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          )}
        </div>
      </div>

      <motion.div
        className="fixed bottom-16 right-3 z-40 hidden lg:block xl:bottom-24 xl:right-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div
          className="flex flex-col items-end gap-0 rounded-base border-2 border-ink bg-card p-3 shadow-neo"
          style={{ width: 220 }}
        >
          <AnimatePresence>
            {showImageOnHover && (
              <motion.div
                key="project-image-container"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 120, marginBottom: 12 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
                className="w-full overflow-hidden"
              >
                <div className="relative h-[120px] w-full overflow-hidden rounded-base border-2 border-ink bg-surface">
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
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-3 w-full">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-violet">{activeProjectLabel}</p>
            <p className="truncate font-body text-sm font-bold">
              {hoveredProject === 'prev' && prevProject
                ? prevProject.title
                : hoveredProject === 'next' && nextProject
                  ? nextProject.title
                  : defaultProject?.title}
            </p>
          </div>

          <div className="flex w-full items-center justify-end gap-2">
            {prevProject ? (
              <Link href={`/project/${prevProject.slug}`}>
                <button
                  className="rounded-base border-2 border-ink bg-card p-3 transition-all hover:translate-x-[-2px] hover:translate-y-[2px] hover:bg-lime"
                  aria-label="Previous project"
                  onMouseEnter={() => setHoveredProject('prev')}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </Link>
            ) : (
              <div className="rounded-base border-2 border-ink/20 bg-surface p-3 opacity-50">
                <ChevronLeft className="h-5 w-5" />
              </div>
            )}

            {nextProject ? (
              <Link href={`/project/${nextProject.slug}`}>
                <button
                  className="rounded-base border-2 border-ink bg-card p-3 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-lime"
                  aria-label="Next project"
                  onMouseEnter={() => setHoveredProject('next')}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </Link>
            ) : (
              <div className="rounded-base border-2 border-ink/20 bg-surface p-3 opacity-50">
                <ChevronRight className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};
