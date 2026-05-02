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

  const breadcrumbText = isDark ? 'text-gray-500' : 'text-slate-500';
  const breadcrumbLink = isDark ? 'hover:text-white' : 'hover:text-slate-900';
  const breadcrumbCurrent = isDark ? 'text-gray-300' : 'text-slate-700';
  const categoryBadge = isDark
    ? 'text-accent-400 bg-accent-500/10 border-accent-500/20'
    : 'text-accent-700 bg-accent-500/10 border-accent-500/25 shadow-sm';
  const subCategoryBadge = isDark
    ? 'text-white bg-gray-700/60 border-gray-600/40'
    : 'text-slate-700 bg-white/80 border-slate-200/80 shadow-sm';
  const titleText = isDark ? 'text-white' : 'text-slate-950';
  const bodyText = isDark ? 'text-gray-400' : 'text-slate-600';
  const cardSurface = isDark
    ? 'bg-dark-400/30 border-gray-700/50'
    : 'bg-white/80 border-slate-200/80 shadow-[0_18px_45px_rgba(15,23,42,0.08)]';
  const cardLabel = isDark ? 'text-gray-500' : 'text-slate-500';
  const cardValue = isDark ? 'text-white' : 'text-slate-900';
  const secondaryButton = isDark
    ? 'border-gray-700/50 text-gray-300 hover:border-accent-500/40 hover:text-white hover:bg-accent-500/10'
    : 'border-slate-300/80 bg-white/70 text-slate-700 hover:border-accent-500/30 hover:text-accent-700 hover:bg-accent-50/80 shadow-sm';
  const mediaSurface = isDark
    ? 'bg-dark-400/30 border-gray-700/50'
    : 'bg-white border-slate-200/80 shadow-[0_20px_50px_rgba(15,23,42,0.08)]';
  const dividerColor = isDark ? 'border-gray-800/50' : 'border-slate-200/80';
  const techBadge = isDark
    ? 'text-gray-300 bg-dark-400/30 border-gray-700/50'
    : 'text-slate-700 bg-white/80 border-slate-200/80 shadow-sm';

  return (
    <main
      className={`relative min-h-screen pt-14 sm:pt-16 pb-20 md:pb-0 ${isDark ? 'bg-dark-900' : 'bg-slate-50'}`}
      style={
        isDark
          ? undefined
          : {
              backgroundImage:
                'radial-gradient(circle at top, rgba(168, 85, 247, 0.14) 0%, transparent 28%), radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 24%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 45%, #f8fafc 100%)',
            }
      }
    >
      {!isDark && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/80" />
          <div className="pointer-events-none absolute left-0 right-0 top-0 h-72 bg-gradient-to-b from-white/50 to-transparent" />
        </>
      )}

      {/* Theme Slider */}
      <ThemeSlider />

      {/* Project Navigation */}
      <ProjectNavigation
        prevProject={prevProject}
        nextProject={nextProject}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Breadcrumb */}
          <motion.nav
            variants={itemVariants}
            className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm mb-4 sm:mb-6 md:mb-8 ${breadcrumbText}`}
          >
            <Link href="/" className={`transition-colors ${breadcrumbLink}`}>
              Home
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <Link href="/#work" className={`transition-colors ${breadcrumbLink}`}>
              Portfolio
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className={`truncate max-w-[120px] sm:max-w-none ${breadcrumbCurrent}`}>{project.title}</span>
          </motion.nav>

          {/* Category */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 flex-wrap mb-3 sm:mb-4">
            <span className={`inline-block px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-mono border rounded-full ${categoryBadge}`}>
              {categoryLabels[project.category] || project.category}
            </span>
            {project.subCategories?.map((subCat, index) => (
              <span
                key={index}
                className={`inline-block px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-medium border rounded-full ${subCategoryBadge}`}
              >
                {subCat}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 ${titleText}`}
          >
            {project.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className={`text-base sm:text-lg max-w-3xl mb-8 sm:mb-10 md:mb-12 leading-relaxed ${bodyText}`}
          >
            {project.description}
          </motion.p>

          {/* Info Cards */}
          <motion.div
            variants={itemVariants}
            className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-2 sm:gap-6 md:mb-12 lg:grid-cols-3"
          >
            {project.role && (
              <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border ${cardSurface}`}>
                <p className={`text-xs sm:text-sm mb-1.5 sm:mb-2 ${cardLabel}`}>Role</p>
                <p className={`font-medium text-sm sm:text-base ${cardValue}`}>{project.role}</p>
              </div>
            )}
            {project.client && (
              <div className={`p-4 sm:p-6 rounded-lg sm:rounded-xl border ${cardSurface}`}>
                <p className={`text-xs sm:text-sm mb-1.5 sm:mb-2 ${cardLabel}`}>Client</p>
                <p className={`font-medium text-sm sm:text-base ${cardValue}`}>{project.client}</p>
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
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-colors text-sm sm:text-base ${
                  isDark
                    ? 'bg-accent-500 text-white hover:bg-accent-400'
                    : 'bg-accent-600 text-white hover:bg-accent-500 shadow-[0_18px_40px_rgba(124,58,237,0.25)]'
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
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border transition-colors text-sm sm:text-base ${secondaryButton}`}
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
            className={`relative w-full aspect-video rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden border mb-8 sm:mb-10 md:mb-12 ${mediaSurface}`}
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
                  className={`relative aspect-video rounded-lg sm:rounded-xl overflow-hidden border ${mediaSurface}`}
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
            className={`mt-10 sm:mt-12 md:mt-16 pt-8 sm:pt-10 md:pt-12 border-t ${dividerColor}`}
          >
            <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${titleText}`}>Tools & Skills</h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {project.tech.map((tech, i) => (
                <span
                  key={i}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-mono border rounded-md sm:rounded-lg ${techBadge}`}
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
