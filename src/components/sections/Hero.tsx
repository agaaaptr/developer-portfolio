"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, ChevronDown, FileText, Globe, Languages, MapPin } from 'lucide-react';
import personalData from '@/data/personal.json';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

const marqueeItems = ['Angular', 'React', 'TypeScript', 'Go', 'REST APIs', 'Claude Code', '57 npm releases'];

const skillCards = [
  { label: 'Angular', sub: 'University systems', rotate: '-rotate-3' },
  { label: 'React', sub: 'Exam-prep LMS', rotate: 'rotate-2' },
  { label: 'TypeScript', sub: 'Types everywhere', rotate: '-rotate-1' },
  { label: 'Go', sub: 'REST + MySQL', rotate: 'rotate-3' },
  { label: 'Claude Code', sub: 'Daily driver', rotate: '-rotate-2' },
  { label: 'OpenCode', sub: '57 npm releases', rotate: 'rotate-1' },
];

const cvLinks = [
  { href: '/api/cv/english', icon: Globe, title: 'English CV', sub: 'Software engineer CV in English (PDF)' },
  { href: '/api/cv/indonesian', icon: Languages, title: 'Indonesian CV', sub: 'CV dalam Bahasa Indonesia (PDF)' },
  { href: '/documents/Gagah-Putra-Anugrah-Portfolio.pdf', icon: FileText, title: 'Project Portfolio', sub: 'Project portfolio document (PDF)', download: true },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-16 top-32 hidden h-8 w-8 -rotate-12 rounded-base border-2 border-ink bg-violet sm:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-28 hidden h-14 w-14 rotate-12 rounded-base border-2 border-ink bg-violet shadow-neo-lg sm:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-52 left-8 hidden h-12 w-12 -rotate-6 rounded-base border-2 border-ink bg-lime shadow-neo md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-12 bottom-64 hidden h-9 w-9 rotate-6 rounded-full border-2 border-ink bg-lime shadow-neo md:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-16 top-40 hidden -rotate-12 font-display text-3xl text-violet md:block"
      >
        ★
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-10 top-52 hidden rotate-6 font-display text-2xl text-lime md:block"
      >
        ✳
      </div>

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

      {/* Rotating circular text badge */}
      <div className="pointer-events-none absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
        <motion.div
          className="h-40 w-40"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <defs>
              <path id="heroCirclePath" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
            </defs>
            <text className="fill-ink font-mono text-[6.5px] font-bold uppercase tracking-[0.18em]">
              <textPath href="#heroCirclePath">Full-stack · Angular · React · Go · TypeScript · OpenCode ·</textPath>
            </text>
            <circle cx="50" cy="50" r="20" className="fill-violet stroke-ink" strokeWidth="2" />
            <text x="50" y="55" textAnchor="middle" className="fill-white font-display text-[12px]">✦</text>
          </svg>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-28 pt-28 sm:px-8 sm:pt-32 lg:px-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-7 lg:gap-9">
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

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            {skillCards.map((card) => (
              <div
                key={card.label}
                className={`${card.rotate} rounded-base border-2 border-ink bg-card px-5 py-4 shadow-neo transition-all hover:rotate-0 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none`}
              >
                <p className="font-display text-xl uppercase leading-none">{card.label}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink/60">{card.sub}</p>
              </div>
            ))}
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
          .hero-marquee-track { animation: heroMarquee 24s linear infinite; }
        `}</style>
        <div className="hero-marquee-track flex w-max whitespace-nowrap">
          {[0, 1, 2, 3].map((copy) => (
            <div key={copy} aria-hidden={copy > 0} className="flex shrink-0 items-center">
              {marqueeItems.map((item) => (
                <span key={item} className="flex items-center font-mono text-xs font-bold uppercase tracking-wider text-ink">
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
