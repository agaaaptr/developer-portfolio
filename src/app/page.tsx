"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Footer } from '@/components/layout/Footer';

// Dynamic imports for sections to avoid hydration issues with framer-motion
const HeroSection = dynamic(
  () => import('@/components/sections/Hero').then((mod) => mod.HeroSection),
  { ssr: false }
);
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
    <div className="min-h-screen bg-dark-900">
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