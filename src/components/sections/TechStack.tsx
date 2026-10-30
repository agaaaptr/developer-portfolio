'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { CSSProperties } from 'react';
import techstack from '@/data/techstack.json';
import { TechLogo } from '@/lib/techLogos';
import { containerVariants, itemVariants } from '@/lib/motion';

const MARQUEE_CSS = `
@keyframes techMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.tech-marquee-track { animation: techMarquee var(--marquee-dur, 36s) linear infinite; animation-direction: var(--marquee-dir, normal); }
.tech-marquee-group:hover .tech-marquee-track { animation-play-state: paused; }
`;

export const TechStackSection = () => {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mt-10"
    >
      <style>{MARQUEE_CSS}</style>

      <div className="space-y-4">
        {techstack.rows.map((row) => {
          const copies = reduce ? [0] : [0, 1];
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
                    <div key={dup} className="flex" aria-hidden={dup === 1 || undefined}>
                      {row.items.map((name, j) => (
                        <div
                          key={`${name}-${j}`}
                          className="mx-2 inline-flex items-center gap-2 rounded-base border-2 border-ink bg-card px-4 py-2.5 shadow-neo"
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-base border-2 border-ink ${
                              j % 2 ? 'bg-violet text-white' : 'bg-lime text-ink'
                            }`}
                          >
                            <TechLogo name={name} />
                          </span>
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
