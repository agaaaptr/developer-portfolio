"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, ChevronDown, FileText, Globe, Languages, MapPin } from 'lucide-react';
import personalData from '@/data/personal.json';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { containerVariants, itemVariants } from '@/lib/motion';

const marqueeItems = [
  'Boring technology wins',
  'Clean code over clever code',
  'Yogyakarta · GMT+7',
  'Exploring AI agent workflows',
  'Ship small, iterate fast',
  'Maintainable systems that outlive the sprint',
];

const cvLinks = [
  { href: '/api/cv/english', icon: Globe, title: 'English CV', sub: 'Software engineer CV in English (PDF)' },
  { href: '/api/cv/indonesian', icon: Languages, title: 'Indonesian CV', sub: 'CV dalam Bahasa Indonesia (PDF)' },
  { href: '/documents/Gagah-Putra-Anugrah-Portfolio.pdf', icon: FileText, title: 'Project Portfolio', sub: 'Project portfolio document (PDF)', download: true },
];

export const HeroSection: React.FC = () => {
  const [isCvDropdownOpen, setIsCvDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [isMarqueeVisible, setIsMarqueeVisible] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const isCompactLayout = useMediaQuery('(max-width: 1023px)');
  const nameParts = personalData.professionalName.trim().split(/\s+/);
  const firstName = nameParts[0] ?? personalData.professionalName;
  const lastName = nameParts.slice(1).join(' ');
  const heroDescription = isCompactLayout
    ? 'Full-stack engineer · Angular, TypeScript & Go'
    : personalData.bio;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isCvDropdownOpen &&
        buttonRef.current &&
        dropdownMenuRef.current &&
        !buttonRef.current.contains(target) &&
        !dropdownMenuRef.current.contains(target)
      ) {
        setIsCvDropdownOpen(false);
      }
    };
    if (isCvDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCvDropdownOpen]);

  useEffect(() => {
    if (!isCvDropdownOpen) {
      setDropdownPosition(null);
      return;
    }
    const updateDropdownPosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 272;
      const viewportPadding = 16;
      const minCenter = viewportPadding + dropdownWidth / 2;
      const maxCenter = window.innerWidth - viewportPadding - dropdownWidth / 2;
      const centerX = Math.max(minCenter, Math.min(rect.left + rect.width / 2, maxCenter));
      setDropdownPosition({ top: rect.bottom + 12, left: centerX });
    };
    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, true);
    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [isCvDropdownOpen]);

  useEffect(() => {
    const onScroll = () => {
      setIsMarqueeVisible(window.scrollY < window.innerHeight);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative flex min-h-screen overflow-hidden bg-surface text-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-8 top-1/4 h-32 w-32 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.45) 1.5px, transparent 1.5px)',
          backgroundSize: '10px 10px',
        }}
      />

      {/* constellation network */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-24 hidden h-28 w-28 text-ink/30 lg:block"
        viewBox="0 0 120 120"
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="1.5">
          <path d="M20 30 L60 20 L100 40 L80 80 L40 70 Z" />
          <path d="M60 20 L80 80" />
        </g>
        <g fill="currentColor">
          <circle cx="20" cy="30" r="3" />
          <circle cx="60" cy="20" r="3" />
          <circle cx="100" cy="40" r="3" />
          <circle cx="80" cy="80" r="3" />
          <circle cx="40" cy="70" r="3" />
        </g>
      </svg>

      {/* dotted diagonal line */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-24 top-1/3 hidden h-40 w-40 text-ink/40 lg:block"
        viewBox="0 0 200 200"
      >
        <path
          d="M10 190 L190 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="0.1 14"
          strokeLinecap="round"
        />
      </svg>

      {/* scattered dot cluster */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-32 hidden h-20 w-20 text-ink/30 lg:block"
        viewBox="0 0 80 80"
      >
        <g fill="currentColor">
          <circle cx="15" cy="20" r="2" />
          <circle cx="35" cy="10" r="3" />
          <circle cx="60" cy="25" r="2" />
          <circle cx="25" cy="50" r="3" />
          <circle cx="50" cy="60" r="2" />
          <circle cx="70" cy="45" r="3" />
          <circle cx="10" cy="70" r="2" />
        </g>
      </svg>

      {/* plus marks */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 left-40 hidden h-6 w-6 text-ink/40 lg:block"
        viewBox="0 0 24 24"
      >
        <path d="M12 3 V21 M3 12 H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-72 left-10 hidden w-40 text-ink/30 lg:block"
        viewBox="0 0 160 24"
        fill="none"
      >
        <path
          d="M2 12 Q 12 2 22 12 T 42 12 T 62 12 T 82 12 T 102 12 T 122 12 T 142 12 T 158 12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-10 hidden h-60 w-60 rounded-full border-2 border-dashed border-ink/15 lg:block"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-28 pt-28 sm:px-8 sm:pt-32 lg:px-12">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex min-w-0 flex-col gap-7 lg:gap-9">
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border-2 border-ink bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:shadow-neo">
              {personalData.title}
            </span>
            <span className="rounded-full border-2 border-ink bg-violet px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-neo">
              ● Open to work
            </span>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="font-display uppercase leading-[0.85] tracking-[-0.04em] text-[clamp(4rem,15vw,11.5rem)]">
              <span className="block">{firstName}</span>
              {lastName && (
                <span className="mt-1 inline-block border-4 border-ink bg-lime px-[0.1em] pb-[0.06em] shadow-neo-lg">
                  {lastName}
                </span>
              )}
            </h1>
            <p className="mt-2 flex items-center gap-2 font-hand text-2xl font-bold text-violet">
              that&rsquo;s me <span aria-hidden="true" className="text-xl">⤴</span>
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="max-w-2xl">
            <p className="font-body text-base leading-relaxed text-ink/75 sm:text-lg">{heroDescription}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              ref={buttonRef}
              onClick={() => setIsCvDropdownOpen((current) => !current)}
              aria-expanded={isCvDropdownOpen}
              aria-haspopup="menu"
              aria-label="Download CV or portfolio"
              className="inline-flex items-center justify-between gap-3 rounded-full border-2 border-ink bg-lime px-6 py-3 font-display text-sm uppercase tracking-wide text-ink shadow-neo transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
            >
              Download CV
              <ChevronDown className={`h-4 w-4 transition-transform ${isCvDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('work')}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-violet px-6 py-3 font-display text-sm uppercase tracking-wide text-white shadow-neo transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none"
            >
              See selected work
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink/60">
            <MapPin className="h-4 w-4 text-violet" />
            <span>{personalData.location}</span>
          </motion.div>
        </motion.div>
      </div>

      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isCvDropdownOpen && dropdownPosition && (
              <div className="fixed" style={{ top: dropdownPosition.top, left: dropdownPosition.left, transform: 'translateX(-50%)', zIndex: 80 }}>
                <motion.div
                  ref={dropdownMenuRef}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="w-[272px] overflow-hidden rounded-base border-2 border-ink bg-card shadow-neo"
                >
                  <div className="flex flex-col">
                    {cvLinks.map((link, i) => (
                      <a
                        key={link.href}
                        href={link.href}
                        download={link.download}
                        onClick={() => setIsCvDropdownOpen(false)}
                        className={`group flex items-center gap-3 px-4 py-3 font-body text-sm text-ink transition-all hover:bg-lime ${
                          i > 0 ? 'border-t-2 border-ink/10' : ''
                        }`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-base border border-ink/20 transition-colors group-hover:border-ink group-hover:bg-violet group-hover:text-white">
                          <link.icon className="h-4 w-4" />
                        </span>
                        <span className="flex flex-col">
                          <span className="font-bold">{link.title}</span>
                          <span className="font-mono text-[11px] text-ink/60">{link.sub}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Marquee strip */}
      <div
        className={`fixed inset-x-0 bottom-0 z-20 overflow-hidden border-t-2 border-ink bg-lime py-2 transition-opacity duration-300 ${
          isMarqueeVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <style>{`
          @keyframes heroMarquee { from { transform: translateX(0); } to { transform: translateX(-25%); } }
          .hero-marquee-track { animation: heroMarquee 60s linear infinite; }
        `}</style>
        <div className="hero-marquee-track flex w-max whitespace-nowrap">
          {[0, 1, 2, 3].map((copy) => (
            <div key={copy} aria-hidden={copy > 0} className="flex shrink-0 items-center">
              {marqueeItems.map((item) => (
                <span key={item} className="flex items-center font-mono text-xs font-medium text-ink">
                  <span className="px-6">{item}</span>
                  <span aria-hidden="true" className="pr-6">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
