"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Layout, Smartphone } from 'lucide-react';
import expertiseData from '@/data/expertise.json';

const iconMap: Record<string, React.ElementType> = {
  code: Code2,
  layout: Layout,
  smartphone: Smartphone,
};

interface ExpertiseCardProps {
  expertise: {
    id: number;
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    technologies: string[];
  };
  index: number;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ expertise, index }) => {
  const Icon = iconMap[expertise.icon] || Code2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        duration: 0.6, 
        delay: 0.3 + index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <motion.div
        className="relative h-full p-6 md:p-8 rounded-2xl bg-dark-400/50 border border-gray-700/50 backdrop-blur-sm group cursor-pointer overflow-hidden"
        whileHover={{ 
          y: -8,
          borderColor: 'rgba(168, 85, 247, 0.4)',
        }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
      >
        {/* Hover gradient effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-navy-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            className="w-14 h-14 mb-6 rounded-xl bg-dark-300/50 border border-gray-700/50 flex items-center justify-center group-hover:border-accent-500/30 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.2 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon className="w-7 h-7 text-accent-400" />
          </motion.div>

          {/* Title & Subtitle */}
          <motion.h3 
            className="text-xl md:text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.2 }}
          >
            {expertise.title}
          </motion.h3>
          <motion.p 
            className="text-sm font-mono text-accent-400 mb-4"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.65 + index * 0.2 }}
          >
            {expertise.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p 
            className="text-gray-400 text-sm md:text-base leading-relaxed mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.7 + index * 0.2 }}
          >
            {expertise.description}
          </motion.p>

          {/* Technologies */}
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.75 + index * 0.2 }}
          >
            {expertise.technologies.map((tech, i) => (
              <motion.span
                key={i}
                className="px-3 py-1 text-xs font-mono text-gray-400 bg-dark-300/50 border border-gray-700/50 rounded-full"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.2 + i * 0.05 }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-2xl" />
      </motion.div>
    </motion.div>
  );
};

export const ExpertiseSection: React.FC = () => {
  return (
    <section
      id="expertise"
      className="relative py-8 md:py-12 bg-dark-900 overflow-hidden"
    >
      {/* Fade from hero section */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #0a0a12 0%, transparent 100%)',
        }}
      />
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      
      {/* Code snippet decoration */}
      <motion.div
        className="absolute top-20 right-10 font-mono text-xs text-gray-800 hidden lg:block max-w-xs"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2 }}
      >
        <pre className="opacity-30">
{`const skills = {
  frontend: ['React', 'Next.js'],
  mobile: ['Flutter', 'RN'],
  backend: ['Node', 'Python']
};`}
        </pre>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            My <span className="text-accent-400">Expertise</span>
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-gray-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Specialized in building modern, scalable applications across multiple platforms
          </motion.p>
        </motion.div>

        {/* Expertise Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {expertiseData.expertise.map((item, index) => (
            <ExpertiseCard key={item.id} expertise={item} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
    </section>
  );
};
