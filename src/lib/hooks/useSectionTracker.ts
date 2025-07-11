"use client";

import { useEffect, useState, useRef } from 'react';

interface SectionInfo {
  id: string;
  name: string;
}

const sectionMap: Record<string, string> = {
  hero: 'Top',
  about: 'About Me',
  skills: 'My Skills',
  experience: 'Experience',
  projects: 'Projects',
  capabilities: 'Capabilities',
  contact: 'Contact',
};

export const useSectionTracker = () => {
  const [previousSection, setPreviousSection] = useState<SectionInfo | null>(null);
  const sectionElementsRef = useRef<HTMLElement[]>([]);
  const headerHeightRef = useRef(0);

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      headerHeightRef.current = header.offsetHeight;
    }

    sectionElementsRef.current = Object.keys(sectionMap)
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
      .sort((a, b) => a.offsetTop - b.offsetTop); // Ensure they are sorted top-to-bottom

    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      let currentSectionId: string | null = null;

      // Check if at the very bottom of the page
      if (scrollY + viewportHeight >= documentHeight - 5) { // -5 for a small buffer
        currentSectionId = sectionElementsRef.current[sectionElementsRef.current.length - 1].id;
      } else {
        // Find the section that is currently at the top of the viewport (adjusted for header)
        for (let i = 0; i < sectionElementsRef.current.length; i++) {
          const sectionEl = sectionElementsRef.current[i];
          const sectionTopAdjusted = sectionEl.offsetTop - headerHeightRef.current;

          if (scrollY >= sectionTopAdjusted) {
            currentSectionId = sectionEl.id;
          } else {
            break;
          }
        }

        // Handle case where scrollY is at the very top, before the first section
        if (currentSectionId === null && sectionElementsRef.current.length > 0 && scrollY < sectionElementsRef.current[0].offsetTop - headerHeightRef.current) {
          currentSectionId = 'hero'; // Consider hero as current if at the very top
        } else if (currentSectionId === null && sectionElementsRef.current.length > 0) {
          currentSectionId = sectionElementsRef.current[0].id; // Fallback
        }
      }

      if (currentSectionId) {
        const currentSectionIndex = sectionElementsRef.current.findIndex(
          (el) => el.id === currentSectionId
        );

        // If the current section is 'hero' or 'about', we don't show a 'Return to Previous' button.
        if (currentSectionId === 'hero' || currentSectionId === 'about') {
          setPreviousSection(null);
        } else if (currentSectionIndex > 0) { // If there's a section before the current one
          const potentialPreviousEl = sectionElementsRef.current[currentSectionIndex - 1];
          const potentialPreviousId = potentialPreviousEl.id;

          setPreviousSection({ id: potentialPreviousId, name: sectionMap[potentialPreviousId] });
        } else {
          setPreviousSection(null);
        }
      } else {
        setPreviousSection(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount to set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array to run once on mount

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: offsetTop - (headerHeightRef.current - 10), // Adjust for fixed header, bringing it 10px higher
        behavior: 'smooth',
      });
    }
  };

  return { previousSection, scrollToSection };
};