import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Server, Cloud, Database, Smartphone, Palette } from 'lucide-react'; // Import all necessary icons
import capabilitiesData from '@/data/capabilities.json';
import { ShowMoreButton } from '@/components/ui/ShowMoreButton';
import { GradientCard } from '@/components/ui/GradientCard';

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
  const initialDisplayCount = 2; // For md:grid-cols-2

  const displayedCapabilities = showAll ? capabilitiesData : capabilitiesData.slice(0, initialDisplayCount);

  return (
    <section id="capabilities" className="py-16 px-4 bg-secondary-900 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-4xl font-bold text-center mb-12 text-primary-400"
        >
          What I Can Do
        </motion.h2>

        <motion.div
          layout
          className="grid md:grid-cols-2 gap-8"
        >
          <AnimatePresence>
            {displayedCapabilities.map((capability, index) => {
              const IconComponent = iconMap[capability.icon];
              return (
                <motion.div
                  key={capability.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50, transition: { duration: 0.5 } }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="flex"
                >
                  <GradientCard className="flex flex-col h-full">
                    {IconComponent && <IconComponent className="h-16 w-16 text-accent-400 mb-4" />}
                    <h3 className="text-2xl font-semibold mb-4">{capability.title}</h3>
                    <p className="text-secondary-300 text-justify flex-grow mb-4">
                      {capability.description}
                    </p>
                  </GradientCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        {capabilitiesData.length > initialDisplayCount && (
          <div className="flex justify-center mt-8">
            <ShowMoreButton
              isExpanded={showAll}
              onClick={() => setShowAll(!showAll)}
            />
          </div>
        )}
      </div>
    </section>
  );
};