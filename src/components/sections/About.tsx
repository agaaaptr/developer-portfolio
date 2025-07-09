import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase } from 'lucide-react';
import personalData from '@/data/personal.json';
import Image from 'next/image';

export const AboutSection: React.FC = () => (
  <section id="about" className="py-16 px-4 bg-secondary-900 text-white">
    <div className="max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-4xl font-bold text-center mb-12 text-primary-400"
      >
        About Me
      </motion.h2>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-lg text-secondary-300 leading-relaxed">
            Passionate front-end developer with a keen eye for design and user experience. 
            Currently expanding my skills towards full-stack development.
          </p>
          
          <div className="flex items-center space-x-4 text-secondary-400">
            <MapPin className="h-5 w-5" />
            <span>{personalData.location}</span>
          </div>
          
          <div className="flex items-center space-x-4 text-secondary-400">
            <Briefcase className="h-5 w-5" />
            <span>Available for opportunities</span>
          </div>
        </div>
        
        <div className="flex justify-center">
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
        </div>
      </div>
    </div>
  </section>
);