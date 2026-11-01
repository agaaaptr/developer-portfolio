import type { Metadata } from 'next';
import { ArrowUpRight, Mail } from 'lucide-react';
import { siGithub, siInstagram, siWhatsapp } from 'simple-icons';
import personal from '@/data/personal.json';

export const metadata: Metadata = {
  title: `${personal.professionalName} · ${personal.title}`,
  description: `${personal.professionalName}, ${personal.title} — semua link sosial dan kontak di satu tempat.`,
};

// `siLinkedin` sudah tidak ada di simple-icons (brand dihapus); path diambil dari Contact.tsx.
const LINKEDIN_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

type Link = { label: string; type: string; href: string; path?: string };

// Urutan dikelompokkan berdasarkan tipe: kode → kerja → sosial → chat → email.
const links: Link[] = [
  { label: 'GitHub', type: 'code', href: `https://github.com/${personal.socials.github}`, path: siGithub.path },
  { label: 'LinkedIn', type: 'work', href: `https://linkedin.com/in/${personal.socials.linkedin}`, path: LINKEDIN_PATH },
  { label: 'Instagram', type: 'social', href: `https://instagram.com/${personal.socials.instagram}`, path: siInstagram.path },
  ...(personal.socials.whatsapp
    ? [{ label: 'WhatsApp', type: 'chat', href: `https://wa.me/${personal.socials.whatsapp}`, path: siWhatsapp.path }]
    : []),
  { label: 'Email', type: 'mail', href: `mailto:${personal.email}` },
];

export default function LinksPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-surface font-body text-ink"
      style={{
        backgroundImage:
          'conic-gradient(rgba(0,0,0,0.05) 90deg, transparent 90deg 180deg, rgba(0,0,0,0.05) 180deg 270deg, transparent 270deg)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-16 sm:px-6">
        <header className="mb-10 space-y-4 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">Pick · Your · Door</p>
          <h1 className="font-display uppercase leading-[0.9] tracking-[-0.02em] text-[clamp(2.5rem,9vw,4rem)]">
            {personal.professionalName}
          </h1>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span className="inline-block -rotate-2 border-2 border-ink bg-lime px-3 py-1 font-display text-lg uppercase leading-none shadow-neo">
              links
            </span>
            <span className="font-hand text-2xl text-ink/70">one tap away</span>
          </p>
        </header>

        <ul className="flex flex-col gap-4">
          {links.map(({ label, type, href, path }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex w-full items-center gap-4 rounded-base border-[3px] border-ink bg-card p-3 shadow-neo transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-base border-2 border-ink bg-surface transition-colors group-hover:bg-lime">
                  {path ? (
                    <svg viewBox="0 0 24 24" className="size-5 fill-ink" aria-hidden="true">
                      <path d={path} />
                    </svg>
                  ) : (
                    <Mail className="size-5" aria-hidden="true" />
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="font-display text-base uppercase leading-none sm:text-lg">{label}</span>
                  <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink/50">{type}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-ink/40 transition-colors group-hover:text-ink" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
