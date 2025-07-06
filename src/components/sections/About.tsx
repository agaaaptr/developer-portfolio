/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase } from 'lucide-react';
import personalData from '@/data/personal.json';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import Image from 'next/image';

export const AboutSection: React.FC = () => (
  <AnimatedSection className="py-20 px-4">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">
        <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          About Me
        </span>
      </h2>
      
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
          <div className="w-64 h-64 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full flex items-center justify-center border border-secondary-700">
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
  </AnimatedSection>
);