"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import projectsData from '@/data/projects.json';
import { ProjectFilter, ProjectCategory } from '@/components/projects/ProjectFilter';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

export const WorkSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const [showPreviewNote, setShowPreviewNote] = useState(false);
  const gridContentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');

  const filterOptions = useMemo(() => {
    const allCount = projectsData.length;
    const webCount = projectsData.filter((p) => p.category === 'web').length;
    const mobileCount = projectsData.filter((p) => p.category === 'mobile').length;
    const aiCount = projectsData.filter((p) => p.category === 'ai').length;

    return [
      { id: 'all' as ProjectCategory, label: 'All', count: allCount },
      { id: 'web' as ProjectCategory, label: 'Web Development', count: webCount },
      { id: 'mobile' as ProjectCategory, label: 'Mobile Development', count: mobileCount },
      { id: 'ai' as ProjectCategory, label: 'AI Development', count: aiCount },
    ];
  }, []);

  const indexedProjects = useMemo(
    () => projectsData.map((project, index) => ({ ...project, originalIndex: index })),
    []
  );

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
      className="relative bg-surface py-16 md:py-24"
      style={{
        backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 14px)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">03 — Selected Work</p>
          <h2 className="font-display uppercase leading-[0.9] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5rem)]">
            My{' '}
            <span className="inline-block border-2 border-ink bg-lime px-2 shadow-neo">Work</span>
          </h2>
          <p className="max-w-2xl font-body text-base text-ink/70">
            Angular platforms, WordPress sites, and an OSS agent framework.
          </p>
          <div>
            <Link
              href="/project/all"
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-card px-6 py-3 font-display text-sm uppercase tracking-wide shadow-neo transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
            >
              View All Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <ProjectFilter
          options={filterOptions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <motion.div
          className="overflow-hidden"
          initial={false}
          animate={gridHeight === null ? undefined : { height: gridHeight }}
          transition={{ height: { duration: 0.56, ease: [0.22, 1, 0.36, 1] } }}
        >
          <div ref={gridContentRef} className="px-1 pb-4 pt-3">
            <ProjectGrid projects={visibleProjects} filterKey={activeFilter} />

            <AnimatePresence initial={false}>
              {showPreviewNote && shouldShowPreviewNote && (
                <motion.p
                  className="mt-5 max-w-2xl font-body text-xs leading-relaxed text-ink/50 sm:text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                >
                  Showing {visibleProjects.length} selected projects here. Use{' '}
                  <span className="text-ink/70">View All Projects</span> for the full portfolio.
                </motion.p>
              )}
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <motion.div className="py-16 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="font-body text-lg text-ink/50">No projects found in this category.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
