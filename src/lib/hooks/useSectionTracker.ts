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

    const updateSections = () => {
      sectionElementsRef.current = Object.keys(sectionMap)
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
        .sort((a, b) => a.offsetTop - b.offsetTop); // Ensure they are sorted top-to-bottom
      handleScroll(); // Re-evaluate scroll position after sections are updated
    };

    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;
      let currentSectionId: string | null = null;

      // Check if at the very bottom of the page
      if (scrollY + viewportHeight >= documentHeight - 5) { // -5 for a small buffer
        if (sectionElementsRef.current.length > 0) {
          currentSectionId = sectionElementsRef.current[sectionElementsRef.current.length - 1].id;
        } else {
          currentSectionId = 'hero'; // Fallback if no sections are found
        }
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

    const mainElement = document.querySelector('main');
    if (mainElement) {
      const observer = new MutationObserver((mutations) => {
        if (mutations.some(mutation => mutation.type === 'childList')) {
          updateSections();
        }
      });

      observer.observe(mainElement, { childList: true, subtree: true });
      
      updateSections(); // Initial call to set up sections

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect(); // Disconnect observer on unmount
      };
    } else {
      console.warn("Main element not found for section tracking. Ensure it exists in your layout.");
      window.addEventListener('scroll', handleScroll); // Fallback for scroll handling
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

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