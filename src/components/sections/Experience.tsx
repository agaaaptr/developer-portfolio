import React, { useState } from 'react';
import experienceData from '@/data/experience.json';
import { GradientCard } from '@/components/ui/GradientCard';
import { MapPin, Calendar, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShowMoreButton } from '@/components/ui/ShowMoreButton';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { containerVariants, itemVariants, cardItemVariants } from '@/lib/animations/variants';

export const ExperienceSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 3;

  const isMobile = useMediaQuery('(max-width: 768px)');

  const displayedExperience = showAll ? experienceData.experience : experienceData.experience.slice(0, initialDisplayCount);

  return (
    <section id="experience" className="py-16 px-4 bg-secondary-900 text-white">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2, margin: "-10%" }}
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-bold text-center mb-12 text-primary-400"
        >
          Experience
        </motion.h2>

        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {displayedExperience.map((exp, index) => (
              <motion.div
                  key={exp.id}
                  variants={cardItemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex"
                >
                <GradientCard className="flex flex-col h-full justify-start items-stretch text-left">
                  <div className="flex flex-col h-full">
                    {/* Company & Position */}
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="flex items-center space-x-2 text-white mb-2">
                        <Briefcase className="h-5 w-5" />
                        <h3 className="text-xl font-semibold">{exp.position}</h3>
                      </div>
                      <p className="text-secondary-300 text-center">{exp.company}</p>
                    </div>

                    {/* Duration & Location */}
                    <div className="flex flex-col items-center space-y-2 text-secondary-400 text-sm mb-4">
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
                    <p className="text-secondary-300 text-left whitespace-normal mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Achievements */}
                    {exp.achievements?.length > 0 && (
                      <div className="mt-4">
                        <ul className="space-y-2 text-secondary-300 text-sm">
                          {exp.achievements.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-primary-400 mr-2 mt-1 flex-shrink-0">•</span>
                              <span className="text-left leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {experienceData.experience.length > initialDisplayCount && (
          <motion.div 
            layout
            className="flex justify-center mt-8"
            variants={itemVariants}
          >
            <ShowMoreButton
              isExpanded={showAll}
              onClick={() => setShowAll(!showAll)}
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};
