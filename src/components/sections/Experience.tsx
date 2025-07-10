import React from 'react';
import experienceData from '@/data/experience.json';
import { GradientCard } from '@/components/ui/GradientCard';
import { MapPin, Calendar, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export const ExperienceSection: React.FC = () => (
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experienceData.experience.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex"
          >
            <GradientCard className="flex flex-col">
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
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
