/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/sections/Hero';
import { AboutSection } from '@/components/sections/About';
import { SkillsSection } from '@/components/sections/Skills';
import { ExperienceSection } from '@/components/sections/Experience';
import { ProjectsSection } from '@/components/sections/Projects';
import { ContactSection } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isDark={isDark}
        setIsDark={setIsDark}
      />
      
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
}