"use client";

import dynamic from 'next/dynamic';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/Hero';

// The hero is above the fold, so it renders in the initial HTML instead of a
// client-only chunk. Deferring it made the smaller below-fold sections paint
// first and then shift down when the large hero chunk (three.js + Rapier)
// finally loaded. The remaining sections sit below the fold, so keeping them
// ssr:false avoids their bundle weight without a visible flash.
const ExpertiseSection = dynamic(
  () => import('@/components/sections/Expertise').then((mod) => mod.ExpertiseSection),
  { ssr: false }
);
const WorkSection = dynamic(
  () => import('@/components/sections/Work').then((mod) => mod.WorkSection),
  { ssr: false }
);
const ExperienceSection = dynamic(
  () => import('@/components/sections/Experience').then((mod) => mod.ExperienceSection),
  { ssr: false }
);
const ContactSection = dynamic(
  () => import('@/components/sections/Contact').then((mod) => mod.ContactSection),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <main>
        <HeroSection />
        <ExpertiseSection />
        <WorkSection />
        <ExperienceSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
