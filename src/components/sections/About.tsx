import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase } from 'lucide-react';
import personalData from '@/data/personal.json';
import Image from 'next/image';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { containerVariants, itemVariants } from '@/lib/animations/variants';

export const AboutSection: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const initialY = isMobile ? -10 : -20;
  const duration = isMobile ? 0.3 : 0.5;

  return (
    <section id="about" className="py-16 px-4 bg-secondary-900 text-white">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          variants={itemVariants}
          className="text-4xl font-bold text-center mb-12 text-primary-400"
        >
          About Me
        </motion.h2>
        
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center"
          variants={containerVariants} // Apply container variants to this div as well for its children
        >
          <motion.div className="space-y-6" variants={itemVariants}>
            <motion.p className="text-lg text-secondary-300 text-left whitespace-normal leading-relaxed" variants={itemVariants}>
              Passionate front-end developer with a keen eye for design and user experience. 
              Currently expanding my skills towards full-stack development.
            </motion.p>
            
            <motion.div className="flex items-center space-x-4 text-secondary-400" variants={itemVariants}>
              <MapPin className="h-5 w-5" />
              <span>{personalData.location}</span>
            </motion.div>
            
            <motion.div className="flex items-center space-x-4 text-secondary-400" variants={itemVariants}>
              <Briefcase className="h-5 w-5" />
              <span>Available for opportunities</span>
            </motion.div>
          </motion.div>
          
          <motion.div className="flex justify-center" variants={itemVariants}>
            <div className="relative p-1 rounded-full bg-gradient-to-br from-primary-500 to-accent-500">
              <div className="w-64 h-64 rounded-full overflow-hidden bg-secondary-800 flex items-center justify-center">
                <Image
                  src="/images/profile-photo.jpg"
                  alt="Profile Photo"
                  width={256}
                  height={256}
                  className="rounded-full object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};