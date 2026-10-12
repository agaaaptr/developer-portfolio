'use client';

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import rawProjectsData from '@/data/projects.json';
import { ProjectNavigation } from '@/components/projects/ProjectNavigation';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

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
  github?: string;
  npm?: string;
  demo?: string;
  images?: string[];
  image?: string;
}

const typedProjectsData = rawProjectsData as Project[];

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

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

  const additionalImages = (project.images ?? []).filter((img) => img !== project.image);

  const categoryLabels: Record<string, string> = {
    web: 'Web Development',
    mobile: 'Mobile Development',
    ai: 'AI Development',
  };

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

  const primaryButton =
    'inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-lime px-6 py-3 font-display text-sm uppercase tracking-wide text-ink shadow-neo transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none';
  const secondaryButton =
    'inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-card px-6 py-3 font-display text-sm uppercase tracking-wide text-ink shadow-neo transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none';

  return (
    <main
      className="relative min-h-screen bg-surface pb-20 pt-20 text-ink md:pb-0"
      style={{
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }}
    >
      <ProjectNavigation prevProject={prevProject} nextProject={nextProject} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-12 lg:px-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.nav
            variants={itemVariants}
            className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink/50"
          >
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/#work" className="transition-colors hover:text-ink">
              Portfolio
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="max-w-[160px] truncate text-ink sm:max-w-none">{project.title}</span>
          </motion.nav>

          <motion.div variants={itemVariants} className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full border-2 border-ink bg-lime px-4 py-1.5 font-mono text-xs uppercase tracking-wide text-ink transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo">
              {categoryLabels[project.category] || project.category}
            </span>
            {project.subCategories?.map((subCat, index) => (
              <span
                key={index}
                className="rounded-full border-2 border-ink bg-card px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink/70 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo"
              >
                {subCat}
              </span>
            ))}
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-6 font-display uppercase leading-[0.9] tracking-[-0.02em] text-[clamp(2.5rem,7vw,5rem)]"
          >
            {project.title}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-10 max-w-3xl font-body text-base leading-relaxed text-ink/70 sm:text-lg"
          >
            {project.description}
          </motion.p>

          {project.role && (
            <motion.div variants={itemVariants} className="mb-10">
              <div className="w-fit rounded-base border-2 border-ink bg-card p-5 shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
                <p className="mb-1 font-mono text-xs uppercase tracking-wide text-ink/50">Role</p>
                <p className="font-body text-base font-bold">{project.role}</p>
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="mb-10 flex flex-wrap gap-3">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className={primaryButton}>
                Open Project
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
                View Code
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {project.npm && (
              <a href={project.npm} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
                View on npm
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative mb-10 aspect-video w-full overflow-hidden rounded-base border-2 border-ink bg-card shadow-neo"
          >
            <ImageWithFallback
              src={project.image || ''}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </motion.div>

          {additionalImages.length > 0 && (
            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {additionalImages.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-video overflow-hidden rounded-base border-2 border-ink bg-card shadow-neo"
                >
                  <ImageWithFallback
                    src={img}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
              ))}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="mt-12 border-t-2 border-ink pt-8">
            <h2 className="mb-5 font-display text-2xl uppercase">Tools &amp; Skills</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-base border-2 border-ink bg-card px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:bg-lime"
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
