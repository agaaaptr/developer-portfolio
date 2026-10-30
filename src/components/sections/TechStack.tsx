'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { CSSProperties } from 'react';
import techstack from '@/data/techstack.json';
import { TechLogo } from '@/lib/techLogos';
import { containerVariants, itemVariants } from '@/lib/motion';

const FAN = [
  { rotate: -10.5, y: 20 },
  { rotate: -7.5, y: 10 },
  { rotate: -4.5, y: 4 },
  { rotate: -1.5, y: 0 },
  { rotate: 1.5, y: 0 },
  { rotate: 4.5, y: 4 },
  { rotate: 7.5, y: 10 },
  { rotate: 10.5, y: 20 },
];

const CSS = `
@keyframes techMarquee { from { transform: translateX(0); } to { transform: translateX(-25%); } }
.tech-marquee-track { animation: techMarquee var(--marquee-dur, 36s) linear infinite; animation-direction: var(--marquee-dir, normal); }
.tech-marquee-group { position: relative; }
.tech-marquee-group:hover .tech-marquee-track { animation-play-state: paused; }
.tech-marquee-group::before, .tech-marquee-group::after { content: ''; position: absolute; top: 0; bottom: 0; width: 64px; z-index: 3; pointer-events: none; }
.tech-marquee-group::before { left: 0; background: linear-gradient(90deg, #f0f0f0 12%, rgba(240, 240, 240, 0) 100%); }
.tech-marquee-group::after { right: 0; background: linear-gradient(270deg, #f0f0f0 12%, rgba(240, 240, 240, 0) 100%); }
`;

export const TechStackSection = () => {
  const reduce = useReducedMotion() ?? false;
  const featured = techstack.featured ?? [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="mt-14"
    >
      <style>{CSS}</style>

      {/* fandeck */}
      <div className="mb-10">
        <div className="mb-6 text-center">
          <motion.p variants={itemVariants} className="font-mono text-xs uppercase tracking-[0.3em] text-violet">What I Use</motion.p>
          <motion.h3 variants={itemVariants} className="mt-2 font-display text-2xl uppercase leading-none">Tech Stack</motion.h3>
        </div>
        <div className="overflow-x-auto pt-4 pb-10">
          <div className="flex [justify-content:safe_center]">
            {featured.map((tech, i) => (
              <motion.div
                key={tech.name}
                className="shrink-0"
                style={{ zIndex: i + 1, marginLeft: i === 0 ? 0 : -16 }}
                initial={{ opacity: 0, rotate: 0, y: 60 }}
                whileInView={{ opacity: 1, rotate: FAN[i]?.rotate ?? 0, y: FAN[i]?.y ?? 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex h-[158px] w-[132px] flex-col items-center justify-center gap-2 rounded-base border-2 border-ink bg-card p-4 shadow-neo transition-all hover:-translate-y-2 hover:shadow-neo-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-base border-2 border-ink bg-surface">
                    <TechLogo name={tech.name} colored className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-sm font-bold">{tech.name}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wide text-ink/50">{tech.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* marquee rows */}
      <div className="space-y-4">
        {techstack.rows.map((row) => {
          const copies = reduce ? [0] : [0, 1, 2, 3];
          return (
            <motion.div key={`${row.direction}-${row.duration}`} variants={itemVariants}>
              <div className="tech-marquee-group overflow-hidden py-2">
                <div
                  className={
                    reduce
                      ? 'flex w-max whitespace-nowrap'
                      : 'tech-marquee-track flex w-max whitespace-nowrap will-change-transform'
                  }
                  style={
                    {
                      '--marquee-dur': `${row.duration}s`,
                      '--marquee-dir': row.direction === 'right' ? 'reverse' : 'normal',
                    } as CSSProperties
                  }
                >
                  {copies.map((dup) => (
                    <div key={dup} className="flex" aria-hidden={dup > 0 || undefined}>
                      {row.items.map((name) => (
                        <div
                          key={name}
                          className="mr-4 inline-flex items-center gap-2 rounded-base border-2 border-ink bg-card px-4 py-2.5 shadow-neo"
                        >
                          <TechLogo name={name} colored className="h-5 w-5" />
                          <span className="font-mono text-sm font-bold">{name}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
