'use client';

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import projectsData from '@/data/projects.json';
import { ProjectFilter, ProjectCategory } from '@/components/projects/ProjectFilter';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { ThemeSlider } from '@/components/projects/ThemeSlider';

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
    const webCount = indexedProjects.filter(p => p.category === 'web').length;
    const mobileCount = indexedProjects.filter(p => p.category === 'mobile').length;

    return [
      { id: 'all' as ProjectCategory, label: 'All', count: allCount },
      { id: 'web' as ProjectCategory, label: 'Web Development', count: webCount },
      { id: 'mobile' as ProjectCategory, label: 'Mobile Development', count: mobileCount },
    ];
  }, [indexedProjects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return indexedProjects;
    }
    return indexedProjects.filter(p => p.category === activeFilter);
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
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <main className="min-h-screen bg-dark-900 pt-14 sm:pt-16">
      {/* Theme Slider */}
      <ThemeSlider />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8 sm:mb-10 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4">
              All <span className="text-accent-400">Projects</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl font-mono">
              Browse through my complete portfolio of web development projects
            </p>
          </motion.div>

          {/* Filter */}
          <motion.div variants={itemVariants}>
            <ProjectFilter
              options={filterOptions}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </motion.div>

          {/* Projects Grid */}
          <motion.div variants={itemVariants}>
            <motion.div
              className="overflow-hidden"
              initial={false}
              animate={gridHeight === null ? undefined : { height: gridHeight }}
              transition={{
                height: { duration: 0.56, ease: [0.22, 1, 0.36, 1] },
              }}
            >
              <div ref={gridContentRef}>
                <ProjectGrid projects={filteredProjects} filterKey={activeFilter} />

                {/* Empty state */}
                {filteredProjects.length === 0 && (
                  <motion.div
                    className="text-center py-12 sm:py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-gray-500 text-base sm:text-lg">
                      No projects found in this category.
                    </p>
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
