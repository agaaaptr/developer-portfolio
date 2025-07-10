"use client";

import { useEffect } from 'react';

const sectionColors: Record<string, { start: string; end: string }> = {
  hero: { start: '#1a202c', end: '#2d3748' }, // Dark Slate to Dark Gray
  about: { start: '#2d3748', end: '#4a5568' }, // Dark Gray to Grayish Blue
  skills: { start: '#4a5568', end: '#6b7280' }, // Grayish Blue to Medium Gray
  experience: { start: '#6b7280', end: '#4a5568' }, // Medium Gray to Grayish Blue
  projects: { start: '#4a5568', end: '#2d3748' }, // Grayish Blue to Dark Gray
  capabilities: { start: '#2d3748', end: '#1a202c' }, // Dark Gray to Dark Slate
  contact: { start: '#1a202c', end: '#2d3748' }, // Dark Slate to Dark Gray
};

export const BackgroundManager: React.FC = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const colors = sectionColors[sectionId];
            if (colors) {
              document.body.style.setProperty('--color-start', colors.start);
              document.body.style.setProperty('--color-end', colors.end);
            }
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% of the section is visible
    );

    sections.forEach(section => observer.observe(section));

    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  return null;
};