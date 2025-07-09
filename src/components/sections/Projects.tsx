import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import projectsData from '@/data/projects.json';
import { GradientCard } from '@/components/ui/GradientCard';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const ProjectsSection: React.FC = () => (
  <section id="projects" className="py-16 px-4 bg-secondary-900 text-white">
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-4xl font-bold text-center mb-12 text-primary-400"
      >
        Featured Projects
      </motion.h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <GradientCard>
              <div className="space-y-4">
                <div className="w-full h-48 rounded-lg overflow-hidden relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <p className="text-secondary-300">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-secondary-400 hover:text-primary-400 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span>Code</span>
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-secondary-400 hover:text-primary-400 transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <span>Demo</span>
                  </a>
                </div>
              </div>
            </GradientCard>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);