import React from 'react';
import { Palette, Code2, Smartphone } from 'lucide-react';
import skillsData from '@/data/skills.json';
import { GradientCard } from '@/components/ui/GradientCard';
import { motion } from 'framer-motion';

export const SkillsSection: React.FC = () => (
  <section id="skills" className="py-16 px-4 bg-secondary-900 text-white">
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-4xl font-bold text-center mb-12 text-primary-400"
      >
        Skills & Technologies
      </motion.h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {skillsData.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex"
          >
            <GradientCard className="flex flex-col">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center">
                  {category.category === 'Frontend' && <Palette className="h-8 w-8 text-primary-400" />}
                  {category.category === 'Backend' && <Code2 className="h-8 w-8 text-primary-400" />}
                  {category.category === 'Tools' && <Smartphone className="h-8 w-8 text-primary-400" />}
                </div>
                
                <h3 className="text-xl font-semibold text-white">{category.category}</h3>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {category.items.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-secondary-800/50 text-secondary-300 rounded-full text-sm border border-secondary-700/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </GradientCard>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);