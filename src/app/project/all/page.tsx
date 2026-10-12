'use client';

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import projectsData from '@/data/projects.json';
import { ProjectFilter, ProjectCategory } from '@/components/projects/ProjectFilter';
import { ProjectGrid } from '@/components/projects/ProjectGrid';

export default function AllProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const gridContentRef = useRef<HTMLDivElement>(null);
  const indexedProjects = useMemo(
    () => projectsData.map((project, index) => ({ ...project, originalIndex: index })),
    []
  );

  const filterOptions = useMemo(() => {
    const allCount = indexedProjects.length;
    const webCount = indexedProjects.filter((p) => p.category === 'web').length;
    const mobileCount = indexedProjects.filter((p) => p.category === 'mobile').length;
    const aiCount = indexedProjects.filter((p) => p.category === 'ai').length;

    return [
      { id: 'all' as ProjectCategory, label: 'All', count: allCount },
      { id: 'web' as ProjectCategory, label: 'Web Development', count: webCount },
      { id: 'mobile' as ProjectCategory, label: 'Mobile Development', count: mobileCount },
      { id: 'ai' as ProjectCategory, label: 'AI Development', count: aiCount },
    ];
  }, [indexedProjects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return indexedProjects;
    }
    return indexedProjects.filter((p) => p.category === activeFilter);
  }, [activeFilter, indexedProjects]);

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
  }, [activeFilter, filteredProjects.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <main
      className="min-h-screen bg-surface pt-20 text-ink sm:pt-24"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-12 lg:px-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants} className="mb-10 flex flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">Portfolio</p>
            <h1 className="font-display uppercase leading-[0.9] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5rem)]">
              All{' '}
              <span className="inline-block border-2 border-ink bg-lime px-2 shadow-neo">Projects</span>
            </h1>
            <p className="max-w-2xl font-body text-base text-ink/70">
              Every project I&apos;ve shipped.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <ProjectFilter
              options={filterOptions}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.div
              className="overflow-hidden"
              initial={false}
              animate={gridHeight === null ? undefined : { height: gridHeight }}
              transition={{ height: { duration: 0.56, ease: [0.22, 1, 0.36, 1] } }}
            >
              <div ref={gridContentRef} className="px-1 pb-4">
                <ProjectGrid projects={filteredProjects} filterKey={activeFilter} />

                {filteredProjects.length === 0 && (
                  <motion.div className="py-16 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="font-body text-lg text-ink/50">No projects found in this category.</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
