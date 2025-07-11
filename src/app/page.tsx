"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('@/components/sections/Hero').then((mod) => mod.HeroSection), {
  ssr: false,
});
const AboutSection = dynamic(() => import('@/components/sections/About').then((mod) => mod.AboutSection), {
  ssr: false,
});
const SkillsSection = dynamic(() => import('@/components/sections/Skills').then((mod) => mod.SkillsSection), {
  ssr: false,
});
const ExperienceSection = dynamic(() => import('@/components/sections/Experience').then((mod) => mod.ExperienceSection), {
  ssr: false,
});
const ProjectsSection = dynamic(() => import('@/components/sections/Projects').then((mod) => mod.ProjectsSection), {
  ssr: false,
});
const CapabilitiesSection = dynamic(() => import('@/components/sections/Capabilities').then((mod) => mod.CapabilitiesSection), {
  ssr: false,
});
const ContactSection = dynamic(() => import('@/components/sections/Contact').then((mod) => mod.ContactSection), {
  ssr: false,
});

import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <CapabilitiesSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}