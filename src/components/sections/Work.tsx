"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import projectsData from '@/data/projects.json';
import { ProjectFilter, ProjectCategory } from '@/components/projects/ProjectFilter';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { SectionGridBackground } from '@/components/ui/SectionGridBackground';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

export const WorkSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const [showPreviewNote, setShowPreviewNote] = useState(false);
  const gridContentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');

  // Calculate counts for each category
  const filterOptions = useMemo(() => {
    const allCount = projectsData.length;
    const webCount = projectsData.filter(p => p.category === 'web').length;
    const mobileCount = projectsData.filter(p => p.category === 'mobile').length;

    return [
      { id: 'all' as ProjectCategory, label: 'All', count: allCount },
      { id: 'web' as ProjectCategory, label: 'Web Development', count: webCount },
      { id: 'mobile' as ProjectCategory, label: 'Mobile Development', count: mobileCount },
    ];
  }, []);

  const indexedProjects = useMemo(
    () => projectsData.map((project, index) => ({ ...project, originalIndex: index })),
    []
  );

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return indexedProjects;
    }
    return indexedProjects.filter((p) => p.category === activeFilter);
  }, [activeFilter, indexedProjects]);

  const visibleLimit = isMobile ? 3 : isTablet ? 4 : 6;
  const visibleProjects = useMemo(
    () => filteredProjects.slice(0, visibleLimit),
    [filteredProjects, visibleLimit]
  );
  const shouldShowPreviewNote = filteredProjects.length > visibleProjects.length;

  useEffect(() => {
    if (!shouldShowPreviewNote) {
      setShowPreviewNote(false);
      return;
    }

    setShowPreviewNote(false);
    const timer = window.setTimeout(() => {
      setShowPreviewNote(true);
    }, 760);

    return () => {
      window.clearTimeout(timer);
    };
  }, [activeFilter, shouldShowPreviewNote, visibleProjects.length]);

  useLayoutEffect(() => {
    const node = gridContentRef.current;

    if (!node) {
      return;
    }

    const updateHeight = () => {
      setGridHeight(node.getBoundingClientRect().height);
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [activeFilter, visibleProjects.length]);

  return (
    <section
      id="work"
      className="relative py-8 md:py-12 bg-dark-900 overflow-hidden"
    >
      <SectionGridBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Left aligned */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            My <span className="text-accent-400 relative">
              Work
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-accent-400/50"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
              />
            </span>
          </motion.h2>
          <motion.p 
            className="mt-3 max-w-2xl font-mono text-sm leading-relaxed text-gray-400 sm:mt-4 sm:text-base md:max-w-[42rem] lg:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A collection of projects I&apos;ve worked on, showcasing my skills in frontend, backend, and UI/UX development
          </motion.p>
          
          {/* View All Projects Button - links to first project */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href={`/project/${projectsData[0]?.slug || 'devconnect'}`}>
              <motion.button
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500/10 border border-accent-500/30 text-accent-400 rounded-xl font-medium hover:bg-accent-500/20 hover:border-accent-500/50"
                whileHover={{ y: -2, x: 4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
              >
                <span>View All Projects</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Filter - Left aligned with "Filter by" label */}
        <ProjectFilter
          options={filterOptions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <motion.div
          className="overflow-hidden"
          initial={false}
          animate={gridHeight === null ? undefined : { height: gridHeight }}
          transition={{
            height: { duration: 0.56, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          <div ref={gridContentRef}>
            {/* Projects Grid */}
            <ProjectGrid projects={visibleProjects} filterKey={activeFilter} />

            <AnimatePresence initial={false}>
              {showPreviewNote && shouldShowPreviewNote && (
                <motion.p
                  className="mt-5 max-w-2xl text-xs leading-relaxed text-gray-500 sm:text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  Showing {visibleProjects.length} selected projects here.
                  Use <span className="text-gray-400">View All Projects</span> for the full portfolio.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {filteredProjects.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-500 text-lg">
                  No projects found in this category.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
    </section>
  );
};
