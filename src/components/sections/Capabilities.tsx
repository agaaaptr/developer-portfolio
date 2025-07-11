import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Server, Cloud, Database, Smartphone, Palette } from 'lucide-react';
import capabilitiesData from '@/data/capabilities.json';
import { ShowMoreButton } from '@/components/ui/ShowMoreButton';
import { GradientCard } from '@/components/ui/GradientCard';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { containerVariants, itemVariants } from '@/lib/animations/variants';

const iconMap: { [key: string]: React.ElementType } = {
  Code: Code,
  Server: Server,
  Cloud: Cloud,
  Database: Database,
  Smartphone: Smartphone,
  Palette: Palette,
};

export const CapabilitiesSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 2;

  const isMobile = useMediaQuery('(max-width: 768px)');
  const initialY = isMobile ? -10 : -20;
  const duration = isMobile ? 0.3 : 0.5;
  const initialYCard = isMobile ? 20 : 50;
  const durationCard = isMobile ? 0.3 : 0.5;

  const displayedCapabilities = showAll ? capabilitiesData : capabilitiesData.slice(0, initialDisplayCount);

  return (
    <section id="capabilities" className="py-16 px-4 bg-secondary-900 text-white">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-bold text-center mb-12 text-primary-400"
        >
          What I Can Do
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {displayedCapabilities.map((capability, index) => {
              const IconComponent = iconMap[capability.icon];
              return (
                <motion.div
                  key={capability.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50, transition: { type: "spring", stiffness: 400, damping: 10 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 10, delay: index * 0.1 }}
                  className="flex"
                >
                  <GradientCard className="flex flex-col h-full justify-start items-stretch text-left">
                    <div className="flex flex-col h-full">
                      {/* Icon */}
                      <div className="flex justify-center mb-4">
                        {IconComponent && <IconComponent className="h-16 w-16 text-accent-400" />}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-2xl font-semibold mb-4 text-center">{capability.title}</h3>
                      
                      {/* Description */}
                      <p className="text-secondary-300 text-left whitespace-normal flex-grow leading-relaxed">
                        {capability.description}
                      </p>
                    </div>
                  </GradientCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        
        {capabilitiesData.length > initialDisplayCount && (
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