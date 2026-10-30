'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import personalData from '@/data/personal.json';
import { containerVariants, itemVariants } from '@/lib/motion';

interface Contribution {
  date: string;
  count: number;
  level: number;
}

const LEVEL_COLORS = ['#f0f0f0', '#eaffa8', '#d8ff63', '#c6ff34', '#8fbf00'];
const WEEKDAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP;
const WEEKDAY_W = 28;

function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function buildWeeks(contribs: Contribution[]) {
  const byDate = new Map(contribs.map((c) => [c.date, c]));
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 365);
  start.setDate(start.getDate() - start.getDay()); // back to Sunday

  const weeks: (Contribution | null)[][] = [];
  const monthLabels: { index: number; label: string }[] = [];
  let total = 0;
  let lastMonth = -1;
  const cursor = new Date(start);
  let weekIndex = 0;

  while (cursor <= end) {
    const week: (Contribution | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const key = toKey(cursor);
      const cell = byDate.get(key) ?? null;
      week.push(cell);
      if (cell) total += cell.count;
      if (d === 0) {
        const m = cursor.getMonth();
        if (m !== lastMonth) {
          monthLabels.push({ index: weekIndex, label: MONTHS[m] });
          lastMonth = m;
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
    weekIndex++;
  }

  return { weeks, monthLabels, total };
}

export const ContributionsSection = () => {
  const [status, setStatus] = useState<'loading' | 'error' | 'ok'>('loading');
  const [contribs, setContribs] = useState<Contribution[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://github-contributions-api.jogruber.de/v4/${personalData.socials.github}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setContribs(Array.isArray(json.contributions) ? json.contributions : []);
        setStatus('ok');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { weeks, monthLabels, total } = buildWeeks(contribs);

  return (
    <section
      id="contributions"
      className="relative bg-surface py-16 md:py-24"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-10"
        >
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">05 — Open Source</p>
            <h2 className="font-display uppercase leading-[0.9] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5rem)]">
              GitHub{' '}
              <span className="inline-block border-2 border-ink bg-lime px-2 shadow-neo">
                Contributions
              </span>
            </h2>
            <p className="font-body text-base text-ink/70">
              A year of commits to client work, university systems, and open-source packages.
            </p>
          </motion.div>

          {status === 'loading' && (
            <motion.p variants={itemVariants} className="font-mono text-sm text-ink/50">
              Loading contributions…
            </motion.p>
          )}

          {status === 'error' && (
            <motion.p variants={itemVariants} className="font-mono text-sm text-ink/60">
              Couldn&apos;t load the contribution graph right now — it pulls from GitHub directly, so
              try again in a moment.
            </motion.p>
          )}

          {status === 'ok' && (
            <motion.div
              variants={itemVariants}
              className="rounded-base border-2 border-ink bg-card p-6 shadow-neo"
            >
              <div className="overflow-x-auto pb-1">
                <div style={{ minWidth: 'max-content' }}>
                  <div className="relative h-4" style={{ marginLeft: WEEKDAY_W }}>
                    {monthLabels.map((m) => (
                      <span
                        key={m.index}
                        className="absolute font-mono text-[10px] leading-4 text-ink/40"
                        style={{ left: m.index * STEP }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>

                  <div className="flex" style={{ gap: GAP }}>
                    <div className="flex flex-col" style={{ gap: GAP, width: WEEKDAY_W - GAP }}>
                      {WEEKDAYS.map((label, i) => (
                        <div
                          key={i}
                          className="font-mono text-[10px] leading-[12px] text-ink/40"
                          style={{ height: CELL }}
                        >
                          {label}
                        </div>
                      ))}
                    </div>

                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                        {week.map((cell, di) =>
                          cell ? (
                            <div
                              key={di}
                              className="border border-ink/20"
                              style={{
                                width: CELL,
                                height: CELL,
                                background: LEVEL_COLORS[cell.level] ?? LEVEL_COLORS[0],
                              }}
                              title={`${cell.count} contributions on ${cell.date}`}
                              aria-label={`${cell.count} contributions on ${cell.date}`}
                            />
                          ) : (
                            <div
                              key={di}
                              className="border border-ink/10"
                              style={{ width: CELL, height: CELL, background: LEVEL_COLORS[0] }}
                            />
                          ),
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-mono text-xs text-ink/60">
                      {total} contributions in the last 12 months
                    </p>
                    <div className="flex items-center gap-1 font-mono text-[10px] text-ink/40">
                      Less
                      {LEVEL_COLORS.map((c) => (
                        <span
                          key={c}
                          className="border border-ink/20"
                          style={{ width: 10, height: 10, background: c }}
                        />
                      ))}
                      More
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
