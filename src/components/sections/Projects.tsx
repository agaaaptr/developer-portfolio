import React, { useState } from 'react';
import { Github, ExternalLink, ImageIcon } from 'lucide-react';
import projectsData from '@/data/projects.json';
import { GradientCard } from '@/components/ui/GradientCard';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShowMoreButton } from '@/components/ui/ShowMoreButton';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { containerVariants, itemVariants, cardItemVariants } from '@/lib/animations/variants';

export const ProjectsSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 3;

  const isMobile = useMediaQuery('(max-width: 768px)');

  const displayedProjects = showAll ? projectsData : projectsData.slice(0, initialDisplayCount);

  return (
    <section id="projects" className="py-16 px-4 bg-secondary-900 text-white">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2, margin: isMobile ? "150px" : "-10%" }}
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-bold text-center mb-12 text-primary-400"
        >
          Featured Projects
        </motion.h2>
        
        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, index) => (
              <motion.div
                  key={project.id}
                  variants={cardItemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex"
                >
                <GradientCard className="flex flex-col h-full justify-start items-stretch text-left">
                  <div className="flex flex-col h-full">
                    {/* Image */}
                    <motion.div
                      whileHover={isMobile ? {} : { scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-48 rounded-lg overflow-hidden relative  mb-4"
                    >
                      {project.image && project.image.length > 0 ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill={true}
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary-800 flex flex-col items-center justify-center text-secondary-400 text-lg font-semibold">
                          <ImageIcon className="h-12 w-12 mb-2" />
                          No Image
                        </div>
                      )}
                    </motion.div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white mb-4">{project.title}</h3>
                    
                    {/* Description */}
                    <p className="text-secondary-300 text-left whitespace-normal flex-grow mb-6 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, techIndex) => (
                        <motion.span
                          key={techIndex}
                          whileHover={isMobile ? {} : { scale: 1.1, backgroundColor: "#6366F1" }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-sm"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                    
                    {/* Links */}
                    <div className="flex space-x-4 mt-auto">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary-400 hover:text-primary-400 transition-colors"
                      >
                        <motion.div
                          whileHover={isMobile ? {} : { scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="flex items-center space-x-2"
                        >
                          <Github className="h-5 w-5" />
                          <span>Code</span>
                        </motion.div>
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary-400 hover:text-primary-400 transition-colors"
                      >
                        <motion.div
                          whileHover={isMobile ? {} : { scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="flex items-center space-x-2"
                        >
                          <ExternalLink className="h-5 w-5" />
                          <span>Demo</span>
                        </motion.div>
                      </a>
                    </div>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {projectsData.length > initialDisplayCount && (
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