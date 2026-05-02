"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Anton, Caveat } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { ArrowUpRight, ChevronDown, Globe, Languages, MapPin } from 'lucide-react';
import personalData from '@/data/personal.json';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

const displayFont = Anton({ subsets: ['latin'], weight: '400', display: 'swap' });
const scriptFont = Caveat({ subsets: ['latin'], weight: ['700'], display: 'swap' });
const heroPills = ['Frontend Systems', 'Go APIs', 'Editorial UI'];
const heroAccentLines = ['Frontend craft', 'with precision'];
const heroTagline = 'Built for modern products.';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const glassEnterVariants = {
  hidden: { y: 28, scale: 0.985 },
  visible: {
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const HeroSection: React.FC = () => {
  const [isCvDropdownOpen, setIsCvDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const isCompactLayout = useMediaQuery('(max-width: 1023px)');
  const nameParts = personalData.professionalName.trim().split(/\s+/);
  const primaryName = nameParts[0] ?? personalData.professionalName;
  const secondaryName = nameParts.slice(1).join(' ');
  const heroDescription = isCompactLayout
    ? 'Crafting performant, accessible web experiences with modern frontend systems and polished UI detail.'
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCvDropdownOpen]);

  useEffect(() => {
    if (!isCvDropdownOpen) {
      setDropdownPosition(null);
      return;
    }

    const updateDropdownPosition = () => {
      if (!buttonRef.current) {
        return;
      }

      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 224;
      const viewportPadding = 16;
      const minCenter = viewportPadding + dropdownWidth / 2;
      const maxCenter = window.innerWidth - viewportPadding - dropdownWidth / 2;
      const centerX = Math.max(minCenter, Math.min(rect.left + rect.width / 2, maxCenter));

      setDropdownPosition({
        top: rect.bottom + 12,
        left: centerX,
      });
    };

    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, true);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [isCvDropdownOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#050508]"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 18% 20%, rgba(255,255,255,0.08) 0%, transparent 22%),
            radial-gradient(circle at 84% 16%, rgba(255,255,255,0.07) 0%, transparent 18%),
            radial-gradient(ellipse 72% 62% at 50% 52%, rgba(101, 46, 180, 0.16) 0%, rgba(70, 24, 125, 0.1) 28%, transparent 72%),
            radial-gradient(ellipse 80% 70% at 50% 100%, rgba(147, 51, 234, 0.14) 0%, transparent 70%),
            linear-gradient(180deg, #07070a 0%, #050508 45%, #0a0a12 100%)
          `,
        }}
      />

      <motion.div
        className="absolute inset-x-0 top-[10%] h-[52%] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 36% 42% at 50% 48%, rgba(192, 132, 252, 0.18) 0%, rgba(147, 51, 234, 0.12) 24%, rgba(88, 28, 135, 0.05) 54%, transparent 72%)',
          filter: 'blur(36px)',
        }}
        animate={{
          opacity: [0.72, 0.92, 0.78, 0.72],
          scaleX: [1, 1.03, 0.99, 1],
          scaleY: [1, 1.04, 0.98, 1],
        }}
        transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.34)_100%)]" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[7.25rem] z-0 flex flex-col items-center sm:top-[8.5rem] lg:top-[17%]"
      >
        <span className="text-[clamp(4.6rem,24vw,17rem)] font-black uppercase leading-[0.86] tracking-[-0.09em] text-white/[0.12] sm:text-[clamp(5.2rem,20vw,17rem)] lg:text-[clamp(4.8rem,18vw,17rem)] lg:text-white/[0.08]">
          {primaryName}
        </span>
        {secondaryName && (
          <span className="-mt-[0.09em] text-[clamp(4.6rem,24vw,17rem)] font-black uppercase leading-[0.86] tracking-[-0.09em] text-white/[0.12] sm:text-[clamp(5.2rem,20vw,17rem)] lg:text-[clamp(4.8rem,18vw,17rem)] lg:text-white/[0.08]">
            {secondaryName}
          </span>
        )}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-start px-5 pb-16 pt-24 sm:px-8 sm:pt-28 lg:items-end lg:px-12 lg:pb-24">
        <motion.div
          className="grid w-full gap-8 lg:grid-cols-[minmax(0,270px)_minmax(0,1fr)_minmax(0,260px)] lg:items-end"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="order-2 flex flex-col items-center gap-4 text-center lg:order-1 lg:items-start lg:gap-6 lg:pb-10 lg:text-left"
            variants={itemVariants}
          >
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              {heroPills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-gray-300"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.38em] text-gray-500">
                  {personalData.professionalName}
                </p>
                <h1 className="mx-auto max-w-[11ch] text-[clamp(2.4rem,11vw,4.2rem)] font-semibold leading-[0.98] text-white sm:max-w-[12ch] lg:mx-0 lg:max-w-[14ch] lg:text-[3.2rem]">
                  Building digital products with a sharper visual voice.
                </h1>
              </div>

              <p className="mx-auto max-w-[30ch] text-sm leading-relaxed text-gray-400 sm:max-w-[34ch] sm:text-[15px] lg:mx-0">
                {heroDescription}
              </p>
            </div>

            <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:w-auto lg:justify-start">
              <div className="relative inline-flex w-full sm:w-auto">
                <motion.button
                  ref={buttonRef}
                  onClick={() => setIsCvDropdownOpen((current) => !current)}
                  aria-expanded={isCvDropdownOpen}
                  aria-haspopup="menu"
                  className="group inline-flex w-full items-center justify-between gap-3 rounded-full border border-white/16 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:border-accent-500/45 hover:bg-white/[0.08] sm:w-auto"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
                >
                  Download CV
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-white transition-transform duration-300 ${isCvDropdownOpen ? 'rotate-180' : ''
                      }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </motion.button>
              </div>

              <motion.button
                type="button"
                onClick={() => scrollToSection('work')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-gray-200 transition-colors duration-300 hover:border-white/20 hover:text-white sm:w-auto"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                See selected work
                <ArrowUpRight className="h-4 w-4" />
              </motion.button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 lg:justify-start">
              <MapPin className="h-4 w-4 text-accent-400" />
              <span>{personalData.location}</span>
            </div>
          </motion.div>

          <motion.div
            className="order-1 flex min-h-[250px] items-start justify-center pt-4 sm:min-h-[320px] sm:pt-8 lg:order-2 lg:min-h-[680px] lg:items-center lg:pt-0"
            variants={glassEnterVariants}
          >
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="absolute inset-x-[6%] top-[18%] h-[34%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,rgba(168,85,247,0.14)_26%,transparent_72%)] blur-3xl" />
              <div className="absolute inset-x-[10%] bottom-[12%] h-[24%] rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.18)_0%,rgba(88,28,135,0.08)_46%,transparent_78%)] blur-[52px]" />

              <div className="relative flex w-full flex-col items-center text-center">
                <div className="relative w-full max-w-[680px] py-4 sm:py-6 lg:py-12">
                  <motion.div
                    className="relative top-3 mx-auto max-w-[320px] will-change-transform sm:top-8 sm:max-w-[460px] lg:top-16 lg:max-w-[560px]"
                    animate={{ x: [0, 5, 0, -4, 0], y: [0, -4, 1, -2, 0], rotate: [-0.7, -0.15, 0.45, 0.08, -0.7] }}
                    transition={{ delay: 0.85, duration: 7.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="flex flex-col items-center rounded-[28px] bg-white/[0.014] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-[2px] sm:rounded-[32px] sm:bg-white/[0.01] sm:px-8 sm:py-8 lg:bg-white/[0.005] lg:px-10 lg:py-10">
                      <div className="flex flex-col items-center">
                        <span
                          className={`${scriptFont.className} text-center text-[clamp(2.2rem,9vw,5.3rem)] leading-none text-accent-400/95`}
                          style={{ textShadow: '0 0 28px rgba(168, 85, 247, 0.32)' }}
                        >
                          {heroAccentLines[0]}
                        </span>
                        <span
                          className={`${scriptFont.className} -mt-[0.18em] text-center text-[clamp(2rem,8vw,4.6rem)] leading-none text-accent-300/92`}
                          style={{ textShadow: '0 0 24px rgba(168, 85, 247, 0.24)' }}
                        >
                          {heroAccentLines[1]}
                        </span>
                      </div>

                      <div className="my-5 h-px w-full max-w-[180px] bg-gradient-to-r from-transparent via-white/25 to-transparent sm:my-6" />

                      <p
                        className={`${displayFont.className} text-center text-[clamp(1rem,4vw,2rem)] uppercase leading-[0.92] tracking-[0.08em] text-white`}
                        style={{ textShadow: '0 12px 42px rgba(0, 0, 0, 0.36)' }}
                      >
                        {heroTagline}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="order-3 flex justify-center lg:justify-end lg:pb-10" variants={glassEnterVariants}>
            <div className="grid w-full max-w-[620px] gap-4 sm:grid-cols-2 lg:max-w-[260px] lg:grid-cols-1">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-gray-500">
                  Current focus
                </p>
                <p className="mt-4 text-xl font-semibold leading-[1.02] text-white sm:text-2xl">
                  Web interfaces that feel deliberate.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  Shipping React, Next.js, Go, and UI details that make products feel more premium.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-black/20 p-5 text-sm text-gray-400 sm:p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.36em] text-gray-500">
                  Availability
                </p>
                <p className="mt-3 text-base font-medium text-white">Open for freelance work</p>
                <p className="mt-2 leading-relaxed">
                  Select projects, product collaborations, and frontend-heavy builds with strong visual polish.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {typeof window !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isCvDropdownOpen && dropdownPosition && (
              <div
                className="fixed"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  transform: 'translateX(-50%)',
                  zIndex: 80,
                }}
              >
                <motion.div
                  ref={dropdownMenuRef}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-56 overflow-hidden rounded-2xl border border-gray-700/50 bg-dark-800/95 shadow-2xl backdrop-blur-md"
                >
                  <div className="py-2">
                    <a
                      href="/api/cv/english"
                      className="flex items-center gap-3 px-4 py-3 text-gray-200 transition-all duration-200 hover:bg-accent-500/10 hover:text-white"
                      onClick={() => setIsCvDropdownOpen(false)}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/20 text-accent-400">
                        <Globe className="h-4 w-4" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">English</span>
                        <span className="text-xs text-gray-500">CV in English</span>
                      </div>
                    </a>
                    <a
                      href="/api/cv/indonesian"
                      className="flex items-center gap-3 px-4 py-3 text-gray-200 transition-all duration-200 hover:bg-accent-500/10 hover:text-white"
                      onClick={() => setIsCvDropdownOpen(false)}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/20 text-accent-400">
                        <Languages className="h-4 w-4" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Indonesian</span>
                        <span className="text-xs text-gray-500">CV dalam Bahasa Indonesia</span>
                      </div>
                    </a>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 hidden justify-center lg:flex xl:bottom-28">
        <div className="pointer-events-auto">
          <ScrollIndicator onClick={() => scrollToSection('expertise')} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
    </section>
  );
};
