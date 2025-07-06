import React from 'react';
import { Palette, Code2, Smartphone } from 'lucide-react';
import skillsData from '@/data/skills.json';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { GradientCard } from '@/components/ui/GradientCard';

export const SkillsSection: React.FC = () => (
  <AnimatedSection className="py-20 px-4 bg-secondary-900/30">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">
        <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          Skills & Technologies
        </span>
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {skillsData.map((category, index) => (
          <GradientCard key={index}>
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
        ))}
      </div>
    </div>
  </AnimatedSection>
);