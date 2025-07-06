import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import projectsData from '@/data/projects.json';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { GradientCard } from '@/components/ui/GradientCard';

export const ProjectsSection: React.FC = () => (
  <AnimatedSection className="py-20 px-4 bg-secondary-900/30">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">
        <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          Featured Projects
        </span>
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((project) => (
          <GradientCard key={project.id}>
            <div className="space-y-4">
              <div className="w-full h-48 bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-lg flex items-center justify-center">
                <span className="text-secondary-400">Project Image</span>
              </div>
              
              <h3 className="text-xl font-semibold text-white">{project.title}</h3>
              <p className="text-secondary-300">{project.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex space-x-4">
                <a
                  href={project.github}
                  className="flex items-center space-x-2 text-secondary-400 hover:text-primary-400 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>Code</span>
                </a>
                <a
                  href={project.demo}
                  className="flex items-center space-x-2 text-secondary-400 hover:text-primary-400 transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>Demo</span>
                </a>
              </div>
            </div>
          </GradientCard>
        ))}
      </div>
    </div>
  </AnimatedSection>
);