"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Monitor, Terminal, Bot } from 'lucide-react';
import expertiseData from '@/data/expertise.json';

const iconMap: Record<string, React.ElementType> = {
  monitor: Monitor,
  terminal: Terminal,
  bot: Bot,
};

interface ExpertiseItem {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
}

const ExpertiseCard: React.FC<{ expertise: ExpertiseItem; index: number }> = ({
  expertise,
  index,
}) => {
  const Icon = iconMap[expertise.icon] || Monitor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-base border-2 border-ink bg-card p-6 shadow-neo transition-[translate,box-shadow] hover:-translate-y-1 hover:shadow-neo-lg md:p-8"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-base border-2 border-ink bg-lime shadow-neo transition-all group-hover:translate-x-[3px] group-hover:translate-y-[3px] group-hover:shadow-none">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="font-display text-2xl uppercase leading-none">{expertise.title}</h3>
      <p className="mt-2 font-mono text-xs uppercase tracking-wide text-violet">
        {expertise.subtitle}
      </p>
      <p className="mt-4 font-body text-sm leading-relaxed text-ink/70">
        {expertise.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {expertise.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-base border-2 border-ink bg-surface px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export const ExpertiseSection: React.FC = () => {
  return (
    <section
      id="expertise"
      className="relative bg-surface py-16 md:py-24"
      style={{
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">02 — What I do</p>
          <h2 className="font-display uppercase leading-[0.9] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5rem)]">
            My{' '}
            <span className="inline-block border-2 border-ink bg-lime px-2 shadow-neo">
              Expertise
            </span>
          </h2>
          <p className="max-w-2xl font-body text-base text-ink/70">
            Frontend, backend, and AI-assisted work: Angular interfaces to Go APIs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {expertiseData.expertise.map((item, index) => (
            <ExpertiseCard key={item.id} expertise={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
