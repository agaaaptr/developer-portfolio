'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { GithubIcon } from '@/components/ui/BrandIcons';
import { PROJECT_CATEGORY_LABELS } from './ProjectFilter';

const NpmIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
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
  npm?: string;
  demo?: string;
  originalIndex?: number;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  size?: 'small' | 'medium' | 'large';
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.44, delay: 0.06 + index * 0.045, ease: [0.25, 0.46, 0.45, 0.94] as const },
    transitionEnd: { filter: 'none' },
  }),
  exit: { opacity: 0, y: 16, transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] as const } },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, size = 'medium' }) => {
  const sizeClasses = {
    small: 'min-h-[300px]',
    medium: 'min-h-[350px]',
    large: 'min-h-[420px]',
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      exit="exit"
      className={sizeClasses[size]}
    >
      <div className="group h-full overflow-hidden rounded-base border-2 border-ink bg-card shadow-neo transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
        <div className="relative aspect-video overflow-hidden border-b-2 border-ink bg-surface">
          <ImageWithFallback
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <div className="absolute left-4 top-4">
            <span className="rounded-full border-2 border-ink bg-lime px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide text-ink">
              {PROJECT_CATEGORY_LABELS[project.category] || project.category}
            </span>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <h3 className="font-display text-xl uppercase leading-none">{project.title}</h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-ink/60 line-clamp-2">
            {project.shortDescription}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-base border border-ink/30 bg-surface px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-ink/70"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="font-mono text-xs text-ink/50">+{project.tech.length - 4}</span>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t-2 border-ink/10 pt-4">
            <Link
              href={`/project/${project.slug}`}
              className="flex items-center gap-2 font-body text-sm font-bold transition-colors hover:text-violet"
            >
              Show project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex items-center gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink/50 transition-colors hover:text-ink"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {project.npm && (
                <a
                  href={project.npm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink/50 transition-colors hover:text-ink"
                  onClick={(e) => e.stopPropagation()}
                >
                  <NpmIcon />
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink/50 transition-colors hover:text-ink"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
