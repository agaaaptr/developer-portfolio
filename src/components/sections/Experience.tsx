"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, ExternalLink } from 'lucide-react';
import experienceData from '@/data/experience.json';
import { Accordion } from '@/components/ui/Accordion';

interface ExperienceItem {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  website?: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

const ExperienceContent: React.FC<{ experience: ExperienceItem }> = ({ experience }) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Location & Website */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{experience.location}</span>
        </div>
        {experience.website && (
          <a
            href={experience.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 sm:gap-2 text-accent-400 hover:text-accent-300 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Website</span>
            <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </a>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
        {experience.description}
      </p>

      {/* Achievements */}
      {experience.achievements && experience.achievements.length > 0 && (
        <ul className="space-y-1.5 sm:space-y-2 mt-3 sm:mt-4">
          {experience.achievements.map((achievement, index) => (
            <li key={index} className="flex items-start gap-2 sm:gap-3 text-gray-400 text-sm sm:text-base">
              <span className="text-accent-400 mt-1 sm:mt-1.5 flex-shrink-0 text-xs sm:text-base">▹</span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Technologies */}
      {experience.technologies && experience.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t border-gray-800/50">
          {experience.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono text-gray-400 bg-dark-300/50 border border-gray-700/50 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const ExperienceSection: React.FC = () => {
  const accordionItems = experienceData.experience.map((exp) => ({
    id: exp.id,
    title: exp.company,
    subtitle: `${exp.position} • ${exp.duration}`,
    content: <ExperienceContent experience={exp} />,
  }));

  return (
    <section
      id="experience"
      className="relative py-8 md:py-12 bg-dark-900 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            My <span className="text-accent-400">Experience</span>
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-gray-400 text-sm sm:text-base md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Professional journey through various roles and companies
          </motion.p>
        </motion.div>

        {/* Accordion - starts with all collapsed */}
        <Accordion 
          items={accordionItems} 
          defaultOpenId={null}
        />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
    </section>
  );
};
