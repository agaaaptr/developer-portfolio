import React from 'react';
import experienceData from '@/data/experience.json';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { GradientCard } from '@/components/ui/GradientCard';
import { MapPin, Calendar, Briefcase } from 'lucide-react';

export const ExperienceSection: React.FC = () => (
  <AnimatedSection className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">
        <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          Experience
        </span>
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experienceData.experience.map((exp) => (
          <GradientCard key={exp.id}>
            <div className="space-y-4">
              {/* Company & Position */}
              <div className="flex items-center space-x-2 text-white">
                <Briefcase className="h-5 w-5" />
                <h3 className="text-xl font-semibold">{exp.position}</h3>
              </div>
              <p className="text-secondary-300">{exp.company}</p>

              {/* Duration & Location */}
              <div className="flex items-center space-x-4 text-secondary-400 text-sm">
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
              <p className="text-secondary-300">{exp.description}</p>

              {/* Achievements */}
              {exp.achievements?.length > 0 && (
                <ul className="list-disc list-inside text-secondary-300 space-y-1">
                  {exp.achievements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </GradientCard>
        ))}
      </div>
    </div>
  </AnimatedSection>
);
