'use client';

import { useEffect, useRef, useState } from 'react';
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
  start.setDate(start.getDate() - start.getDay());

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

export const GitHubActivity = () => {
  const [status, setStatus] = useState<'loading' | 'error' | 'ok'>('loading');
  const [contribs, setContribs] = useState<Contribution[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState(12);
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

  // responsive cell size so the whole grid always fits the card width
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const compute = () => {
      const cs = getComputedStyle(el);
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const size = Math.max(6, Math.min(14, Math.floor((w - WEEKDAY_W - 52 * GAP) / 53)));
      setCell(size);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [status]);

  const { weeks, monthLabels, total } = buildWeeks(contribs);
  const step = cell + GAP;
  const githubUrl = `https://github.com/${personalData.socials.github}`;

  return (
    <div className="mt-14">
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
        <div ref={wrapRef} className="relative rounded-base border-2 border-ink bg-card p-5 shadow-neo">
          <div className="relative h-4" style={{ marginLeft: WEEKDAY_W }}>
            {monthLabels.map((m) => (
              <span
                key={m.index}
                className="absolute font-mono text-[10px] leading-4 text-ink/40"
                style={{ left: m.index * step }}
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
                  style={{ height: cell }}
                >
                  {label}
                </div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                {week.map((c, di) =>
                  c ? (
                    <div
                      key={di}
                      className="border border-ink/20 transition-transform hover:scale-125"
                      style={{ width: cell, height: cell, background: LEVEL_COLORS[c.level] ?? LEVEL_COLORS[0] }}
                      title={`${c.count} contributions on ${c.date}`}
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
                    <div
                      key={di}
                      aria-hidden="true"
                      className="border border-ink/10"
                      style={{ width: cell, height: cell, background: LEVEL_COLORS[0] }}
                    />
                  ),
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="font-mono text-xs text-ink/60">{total} contributions in the last 12 months</p>
            <div className="flex items-center gap-1 font-mono text-[10px] text-ink/40">
              Less
              {LEVEL_COLORS.map((c) => (
                <span key={c} className="border border-ink/20" style={{ width: 10, height: 10, background: c }} />
              ))}
              More
            </div>
          </div>
        </div>
      )}

      {hover && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 whitespace-nowrap rounded-base border-2 border-ink bg-ink px-2.5 py-1 font-mono text-[11px] text-card shadow-neo"
          style={{ left: hover.x, top: hover.y - 32 }}
        >
          {hover.text}
        </div>
      )}
    </div>
  );
};
