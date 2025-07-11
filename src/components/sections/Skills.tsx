import React, { useState } from 'react';
import { Palette, Code2, Smartphone, Database } from 'lucide-react';
import skillsData from '@/data/skills.json';
import { GradientCard } from '@/components/ui/GradientCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ShowMoreButton } from '@/components/ui/ShowMoreButton';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { containerVariants, itemVariants } from '@/lib/animations/variants';

export const SkillsSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 3;

  const isMobile = useMediaQuery('(max-width: 768px)');

  const displayedSkills = showAll ? skillsData : skillsData.slice(0, initialDisplayCount);

  return (
    <section id="skills" className="py-16 px-4 bg-secondary-900 text-white">
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
          Skills & Technologies
        </motion.h2>
        
        <motion.div
          layout
          className="grid md:grid-cols-3 gap-8"
          transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
        >
          <AnimatePresence mode="popLayout">
            {displayedSkills.map((category, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: index * 0.1, layout: { duration: 0.5, ease: "easeInOut" } }}
                className="flex"
              >
                <GradientCard className="flex flex-col h-full justify-start items-center text-center">
                  <div className="flex flex-col h-full items-center">
                    {/* Icon */}
                    <motion.div
                      whileHover={isMobile ? {} : { scale: 1.1, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center mb-4"
                    >
                      {category.category === 'Frontend' && <Palette className="h-8 w-8 text-primary-400" />}
                      {category.category === 'Backend' && <Code2 className="h-8 w-8 text-primary-400" />}
                      {category.category === 'Tools' && <Smartphone className="h-8 w-8 text-primary-400" />}
                      {category.category === 'Mobile' && <Smartphone className="h-8 w-8 text-primary-400" />}
                      {category.category === 'Databases' && <Database className="h-8 w-8 text-primary-400" />}
                    </motion.div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white mb-6">{category.category}</h3>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {category.items.map((skill, skillIndex) => (
                        <motion.span
                          key={skillIndex}
                          whileHover={isMobile ? {} : { scale: 1.1, backgroundColor: "#4A5568" }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="px-3 py-1 bg-secondary-800/50 text-secondary-300 rounded-full text-sm border border-secondary-700/50"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {skillsData.length > initialDisplayCount && (
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