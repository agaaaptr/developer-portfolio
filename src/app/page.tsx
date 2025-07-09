"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/Hero';
import { AboutSection } from '@/components/sections/About';
import { SkillsSection } from '@/components/sections/Skills';
import { ExperienceSection } from '@/components/sections/Experience';
import { ProjectsSection } from '@/components/sections/Projects';
import { CapabilitiesSection } from '@/components/sections/Capabilities';
import { ContactSection } from '@/components/sections/Contact';
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