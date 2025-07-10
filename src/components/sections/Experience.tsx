import React, { useState } from 'react';
import experienceData from '@/data/experience.json';
import { GradientCard } from '@/components/ui/GradientCard';
import { MapPin, Calendar, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShowMoreButton } from '@/components/ui/ShowMoreButton';

export const ExperienceSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 3; // For lg:grid-cols-3

  const displayedExperience = showAll ? experienceData.experience : experienceData.experience.slice(0, initialDisplayCount);

  return (
    <section id="experience" className="py-16 px-4 bg-secondary-900 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-4xl font-bold text-center mb-12 text-primary-400"
        >
          Experience
        </motion.h2>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {displayedExperience.map((exp, index) => (
              <motion.div
                key={exp.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50, transition: { duration: 0.5 } }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="flex"
              >
                <GradientCard className="flex flex-col h-full">
                  <div className="flex flex-col flex-grow space-y-4">
                    {/* Company & Position */}
                    <div className="flex items-center justify-center space-x-2 text-white">
                      <Briefcase className="h-5 w-5" />
                      <h3 className="text-xl font-semibold text-center">{exp.position}</h3>
                    </div>
                    <p className="text-secondary-300 text-center">{exp.company}</p>

                    {/* Duration & Location */}
                    <div className="flex items-center justify-center space-x-4 text-secondary-400 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{exp.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{exp.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-secondary-300 text-justify mb-4">{exp.description}</p>

                    {/* Achievements */}
                    {exp.achievements?.length > 0 && (
                      <ul className="list-disc list-outside text-secondary-300 text-justify space-y-1">
                        {exp.achievements.map((item, idx) => (
                          <li key={idx} className="pl-2">{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {experienceData.experience.length > initialDisplayCount && (
          <motion.div layout className="flex justify-center mt-8">
            <ShowMoreButton
              isExpanded={showAll}
              onClick={() => setShowAll(!showAll)}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};
