"use client";

import React from 'react';
import { MapPin, Globe, ExternalLink } from 'lucide-react';
import experienceData from '@/data/experience.json';
import { Accordion } from '@/components/ui/Accordion';

interface ExperienceItem {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  website?: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

const ExperienceContent: React.FC<{ experience: ExperienceItem }> = ({ experience }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-wide text-ink/60">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-violet" />
          {experience.location}
        </span>
        {experience.website && (
          <a
            href={experience.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-violet transition-colors hover:underline"
          >
            <Globe className="h-4 w-4" />
            Website
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      <p className="font-body text-sm leading-relaxed text-ink/75">{experience.description}</p>

      {experience.achievements && experience.achievements.length > 0 && (
        <ul className="space-y-2">
          {experience.achievements.map((achievement, index) => (
            <li
              key={index}
              className="flex items-start gap-2 font-body text-sm leading-relaxed text-ink/70"
            >
              <span className="mt-0.5 flex-shrink-0 text-violet">▹</span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      )}

      {experience.technologies && experience.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t-2 border-ink/10 pt-4">
          {experience.technologies.map((tech, index) => (
            <span
              key={index}
              className="rounded-base border-2 border-ink bg-surface px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const ExperienceSection: React.FC = () => {
  const accordionItems = experienceData.experience.map((exp) => ({
    id: exp.id,
    title: exp.company,
    subtitle: `${exp.position} • ${exp.duration}`,
    content: <ExperienceContent experience={exp} />,
  }));

  return (
    <section
      id="experience"
      className="relative bg-surface py-16 md:py-24"
      style={{
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1.5px, transparent 1.5px)',
        backgroundSize: '22px 22px',
      }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">04 — Career</p>
          <h2 className="font-display uppercase leading-[0.9] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5rem)]">
            My{' '}
            <span className="inline-block border-2 border-ink bg-violet px-2 text-white shadow-neo">
              Experience
            </span>
          </h2>
          <p className="font-body text-base text-ink/70">
            Three roles: university systems, a freelance LMS, and WordPress agencies.
          </p>
        </div>

        <Accordion items={accordionItems} defaultOpenId={null} />
      </div>
    </section>
  );
};
