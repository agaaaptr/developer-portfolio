'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import rawProjectsData from '@/data/projects.json';
const typedProjectsData = rawProjectsData as Project[];
import { ProjectNavigation } from '@/components/projects/ProjectNavigation';
import { ThemeSlider } from '@/components/projects/ThemeSlider';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { useTheme } from '@/components/layout/ThemeProvider';

interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  subCategories?: string[];
  featured?: boolean;
  description: string;
  shortDescription?: string;
  tech: string[];
  role?: string;
  client?: string;
  strategy?: string;
  github?: string;
  demo?: string;
  images?: string[];
  image?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const project = typedProjectsData.find((p: Project) => p.slug === slug);
  
  const { prevProject, nextProject } = useMemo(() => {
    const currentIndex = typedProjectsData.findIndex((p: Project) => p.slug === slug);
    return {
      prevProject: currentIndex > 0 ? typedProjectsData[currentIndex - 1] : null,
      nextProject: currentIndex < typedProjectsData.length - 1 ? typedProjectsData[currentIndex + 1] : null,
    };
  }, [slug]);

  if (!project) {
    notFound();
  }

  const categoryLabels: Record<string, string> = {
    web: 'Web Development',
    mobile: 'Mobile Development',
  };

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
    <main className="min-h-screen bg-dark-900 pt-14 sm:pt-16 pb-20 md:pb-0">
      {/* Theme Slider */}
      <ThemeSlider />

      {/* Project Navigation */}
      <ProjectNavigation
        prevProject={prevProject}
        nextProject={nextProject}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Breadcrumb */}
          <motion.nav
            variants={itemVariants}
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 md:mb-8"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <Link href="/#work" className="hover:text-white transition-colors">
              Portfolio
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-gray-300 truncate max-w-[120px] sm:max-w-none">{project.title}</span>
          </motion.nav>

          {/* Category */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 flex-wrap mb-3 sm:mb-4">
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-mono text-accent-400 bg-accent-500/10 border border-accent-500/20 rounded-full">
              {categoryLabels[project.category] || project.category}
            </span>
            {project.subCategories?.map((subCat, index) => (
              <span
                key={index}
                className="inline-block px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-white bg-gray-700/60 border border-gray-600/40 rounded-full"
              >
                {subCat}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6"
          >
            {project.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-gray-400 max-w-3xl mb-8 sm:mb-10 md:mb-12 leading-relaxed"
          >
            {project.description}
          </motion.p>

          {/* Info Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12"
          >
            {project.role && (
              <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-dark-400/30 border border-gray-700/50">
                <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">Role</p>
                <p className="text-white font-medium text-sm sm:text-base">{project.role}</p>
              </div>
            )}
            {project.client && (
              <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl bg-dark-400/30 border border-gray-700/50">
                <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">Client</p>
                <p className="text-white font-medium text-sm sm:text-base">{project.client}</p>
              </div>
            )}
          </motion.div>

          {/* Project Links */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12"
          >
            {project.demo && (
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-accent-500 font-semibold hover:bg-accent-400 transition-colors text-sm sm:text-base ${
                  isDark ? 'text-white' : 'text-dark-900'
                }`}
                whileHover={{ y: -2, x: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
              >
                Open Project
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
            )}
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-700/50 text-gray-300 hover:border-accent-500/40 hover:text-white hover:bg-accent-500/10 transition-colors text-sm sm:text-base"
                whileHover={{ y: -2, x: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
              >
                View Code
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.a>
            )}
          </motion.div>

          {/* Project Image */}
          <motion.div
            variants={itemVariants}
            className={`relative w-full aspect-video rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden border mb-8 sm:mb-10 md:mb-12 ${
              isDark ? 'bg-dark-400/30 border-gray-700/50' : 'bg-gray-100 border-gray-300'
            }`}
          >
            <ImageWithFallback
              src={project.image || ''}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              isDark={isDark}
            />
          </motion.div>

          {/* Additional Images */}
          {project.images && project.images.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            >
              {project.images.map((img, index) => (
                <div
                  key={index}
                  className={`relative aspect-video rounded-lg sm:rounded-xl overflow-hidden border ${
                    isDark ? 'bg-dark-400/30 border-gray-700/50' : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                    isDark={isDark}
                  />
                </div>
              ))}
            </motion.div>
          )}

          {/* Tech Stack Details */}
          <motion.div
            variants={itemVariants}
            className="mt-10 sm:mt-12 md:mt-16 pt-8 sm:pt-10 md:pt-12 border-t border-gray-800/50"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Tools & Skills</h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-mono text-gray-300 bg-dark-400/30 border border-gray-700/50 rounded-md sm:rounded-lg"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
