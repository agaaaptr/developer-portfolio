'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

const GithubIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

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
  hidden: { opacity: 0, y: 28 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.44, delay: 0.06 + index * 0.045, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
  exit: { opacity: 0, y: 16, transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] as const } },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, size = 'medium' }) => {
  const sizeClasses = {
    small: 'min-h-[300px]',
    medium: 'min-h-[350px]',
    large: 'min-h-[420px]',
  };

  const categoryLabels: Record<string, string> = {
    web: 'Web Development',
    mobile: 'Mobile Development',
    ai: 'AI Development',
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
              {categoryLabels[project.category] || project.category}
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
                  <GithubIcon />
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
