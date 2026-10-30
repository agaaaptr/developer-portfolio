'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import personalData from '@/data/personal.json';

interface Contribution {
  date: string;
  count: number;
  level: number;
}

const LEVEL_COLORS = ['#e2e2e2', '#d1f0a8', '#a8e063', '#6fbe2d', '#3f7d1a'];
const WEEKDAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const GAP = 3;
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
      if (cursor > end) break; // stop at today, never include future days
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

  // Only label months that have at least 3 week columns in the grid — a partial
  // month at the window edge (1-2 columns) would render a cramped, overlapping label.
  const visibleLabels = monthLabels.filter((m, i) => {
    const next = monthLabels[i + 1]?.index ?? weeks.length;
    return next - m.index >= 3;
  });

  return { weeks, monthLabels: visibleLabels, total };
}

export const GitHubActivity = () => {
  const [status, setStatus] = useState<'loading' | 'error' | 'ok'>('loading');
  const [contribs, setContribs] = useState<Contribution[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://github-contributions-api.jogruber.de/v4/${personalData.socials.github}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const list = json && Array.isArray(json.contributions) ? json.contributions : [];
        if (list.length === 0) {
          setStatus('error');
          return;
        }
        setContribs(list);
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
  const githubUrl = `https://github.com/${personalData.socials.github}`;

  return (
    <motion.div
      className="mt-14"
      initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">Open Source</p>
          <h3 className="font-display text-2xl uppercase leading-none">GitHub Contributions</h3>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-card px-5 py-2.5 font-display text-xs uppercase tracking-wide shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
        >
          View GitHub <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      {status === 'loading' && (
        <p className="font-mono text-sm text-ink/50">Loading contributions…</p>
      )}

      {status === 'error' && (
        <p className="font-mono text-sm text-ink/60">
          Couldn&apos;t load the contribution graph right now — it pulls from GitHub directly, so try
          again in a moment.
        </p>
      )}

      {status === 'ok' && (
        <motion.div
          ref={wrapRef}
          className="relative rounded-base border-2 border-ink bg-card p-5 shadow-neo"
          initial={{ scale: 0.94, opacity: 0, y: 14 }}
          whileInView={{ scale: 1, opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 140, damping: 18 }}
        >
          <div
            className="grid"
            style={{ gridTemplateColumns: `${WEEKDAY_W}px repeat(${weeks.length}, minmax(0, 1fr))`, gap: GAP }}
          >
            <div aria-hidden="true" style={{ gridRow: 1, gridColumn: 1 }} />

            {monthLabels.map((m, i) => {
              const span = (monthLabels[i + 1]?.index ?? weeks.length) - m.index;
              return (
                <span
                  key={m.index}
                  className="whitespace-nowrap font-mono text-[10px] leading-3 text-ink/40"
                  style={{ gridRow: 1, gridColumn: `${m.index + 2} / span ${span}` }}
                >
                  {m.label}
                </span>
              );
            })}

            {WEEKDAYS.map((label, dayIdx) => (
              <Fragment key={dayIdx}>
                <div
                  className="font-mono text-[10px] leading-3 text-ink/40"
                  style={{ gridRow: dayIdx + 2, gridColumn: 1 }}
                >
                  {label}
                </div>
                {weeks.map((week, wi) => {
                  const c = week[dayIdx];
                  const style: React.CSSProperties = {
                    gridRow: dayIdx + 2,
                    gridColumn: wi + 2,
                    aspectRatio: '1',
                    background: c ? (LEVEL_COLORS[c.level] ?? LEVEL_COLORS[0]) : LEVEL_COLORS[0],
                  };
                  return c ? (
                    <div
                      key={wi}
                      className="border border-ink/20 transition-transform hover:scale-125"
                      style={style}
                      aria-label={`${c.count} contributions on ${c.date}`}
                      onMouseEnter={(e) => {
                        const cellRect = e.currentTarget.getBoundingClientRect();
                        const cardRect = wrapRef.current?.getBoundingClientRect();
                        if (cardRect) {
                          setHover({
                            text: `${c.count} contributions on ${c.date}`,
                            x: cellRect.left - cardRect.left + cellRect.width / 2,
                            y: cellRect.top - cardRect.top,
                          });
                        }
                      }}
                      onMouseLeave={() => setHover(null)}
                    />
                  ) : (
                    <div key={wi} aria-hidden="true" className="border border-ink/10" style={style} />
                  );
                })}
              </Fragment>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="font-mono text-xs text-ink/60">{total} contributions in the last year</p>
            <div className="flex items-center gap-1 font-mono text-[10px] text-ink/40">
              Less
              {LEVEL_COLORS.map((c) => (
                <span key={c} className="border border-ink/20" style={{ width: 10, height: 10, background: c }} />
              ))}
              More
            </div>
          </div>

          <AnimatePresence>
            {hover && (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 8 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute z-20 -translate-x-1/2 whitespace-nowrap rounded-base border-2 border-ink bg-ink px-2.5 py-1 font-mono text-[11px] text-card shadow-neo"
                style={{ left: hover.x, top: hover.y - 40 }}
              >
                {hover.text}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1.5 rotate-45 border-b-[3px] border-r-[3px] border-ink bg-ink"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};
