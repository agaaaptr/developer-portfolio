"use client";

import { useEffect } from 'react';

export const BackgroundManager: React.FC = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            document.body.classList.add('section-bg-enter');
          } else {
            document.body.classList.remove('section-bg-enter');
          }
        });
      },
      { threshold: 0.1 } // Adjust threshold as needed
    );

    sections.forEach(section => observer.observe(section));

    return () => sections.forEach(section => observer.unobserve(section));
  }, []);

  return null;
};