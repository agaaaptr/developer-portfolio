"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import personalData from '@/data/personal.json';
import { ScrollIndicator } from '@/components/ui/ScrollIndicator';

// Holographic 3D Cube - simple CSS-based hover with framer-motion idle animation
const HolographicCube: React.FC<{
  size: number;
  position: { x: number; y: number };
  delay: number;
  duration: number;
  colorScheme: 'purple' | 'pink' | 'blue' | 'gold';
  floatRange?: number;
  driftX?: number;
  isGroupHovered: boolean;
}> = ({ size, position, delay, duration, colorScheme, floatRange = 10, driftX = 0, isGroupHovered }) => {
  const [isVisible, setIsVisible] = useState(false);
  const halfSize = size / 2;
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const colors = {
    purple: {
      front: 'linear-gradient(145deg, #2d1f4e 0%, #1a1030 100%)',
      right: 'linear-gradient(180deg, #a855f7 0%, #7c3aed 50%, #5b21b6 100%)',
      left: 'linear-gradient(180deg, #c084fc 0%, #a855f7 50%, #7c3aed 100%)',
      top: 'linear-gradient(135deg, #3b2d5f 0%, #2d1f4e 100%)',
      glow: 'rgba(168, 85, 247, 0.5)',
      border: 'rgba(168, 85, 247, 0.6)',
    },
    pink: {
      front: 'linear-gradient(145deg, #3d1f3d 0%, #2a1030 100%)',
      right: 'linear-gradient(180deg, #ec4899 0%, #db2777 50%, #9d174d 100%)',
      left: 'linear-gradient(180deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
      top: 'linear-gradient(135deg, #4d2d4d 0%, #3d1f3d 100%)',
      glow: 'rgba(236, 72, 153, 0.5)',
      border: 'rgba(236, 72, 153, 0.6)',
    },
    blue: {
      front: 'linear-gradient(145deg, #1e2a4a 0%, #0f1629 100%)',
      right: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
      left: 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
      top: 'linear-gradient(135deg, #2a3a5a 0%, #1e2a4a 100%)',
      glow: 'rgba(59, 130, 246, 0.5)',
      border: 'rgba(59, 130, 246, 0.6)',
    },
    gold: {
      front: 'linear-gradient(145deg, #3d3520 0%, #2a2515 100%)',
      right: 'linear-gradient(180deg, #fbbf24 0%, #d97706 50%, #b45309 100%)',
      left: 'linear-gradient(180deg, #fcd34d 0%, #fbbf24 50%, #d97706 100%)',
      top: 'linear-gradient(135deg, #4d4530 0%, #3d3520 100%)',
      glow: 'rgba(251, 191, 36, 0.5)',
      border: 'rgba(251, 191, 36, 0.6)',
    },
  };
  
  const scheme = colors[colorScheme];

  if (!isVisible) return null;
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1,
        scale: 1,
        // More dynamic floating - larger range, varied movement
        x: [0, driftX, -driftX * 0.3, driftX * 0.7, 0],
        y: [0, -floatRange, -floatRange * 0.4, -floatRange * 0.8, 0],
      }}
      transition={{
        opacity: { duration: 0.8, ease: "easeOut" },
        scale: { duration: 0.8, ease: "easeOut" },
        x: { duration: duration, repeat: Infinity, ease: "easeInOut" },
        y: { duration: duration * 0.8, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {/* Cube wrapper - CSS transitions for hover effects */}
      <div
        style={{ 
          width: size,
          height: size,
          position: 'absolute',
          left: -size / 2,
          top: -size / 2,
          transform: isGroupHovered ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Glow */}
        <div
          className="absolute rounded-full"
          style={{
            inset: -size * 0.5,
            background: `radial-gradient(circle, ${scheme.glow} 0%, transparent 65%)`,
            filter: 'blur(25px)',
            opacity: isGroupHovered ? 1 : 0.6,
            transform: isGroupHovered ? 'scale(1.4)' : 'scale(1)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        />
        
        {/* 3D Cube */}
        <div style={{ perspective: '800px', width: size, height: size }}>
          <motion.div
            style={{ 
              transformStyle: "preserve-3d",
              width: size,
              height: size,
            }}
            animate={{ 
              rotateX: [-15, -18, -15],
              rotateY: [25, 32, 25],
              rotateZ: [0, 1, 0],
            }}
            transition={{ 
              duration: duration, 
              repeat: Infinity, 
              ease: "easeInOut",
            }}
          >
            {/* Front */}
            <div 
              className="absolute rounded-lg"
              style={{ 
                width: size, height: size,
                transform: `translateZ(${halfSize}px)`,
                background: scheme.front,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 0 ${isGroupHovered ? 50 : 30}px ${scheme.glow}`,
                border: `1px solid ${scheme.border}`,
                transition: 'box-shadow 0.4s ease',
              }}
            >
              <div 
                className="absolute inset-[3px] rounded-md opacity-25"
                style={{
                  backgroundImage: `linear-gradient(${scheme.border} 1px, transparent 1px), linear-gradient(90deg, ${scheme.border} 1px, transparent 1px)`,
                  backgroundSize: `${size / 5}px ${size / 5}px`,
                }}
              />
            </div>
            
            {/* Back */}
            <div 
              className="absolute rounded-lg"
              style={{ 
                width: size, height: size,
                transform: `translateZ(-${halfSize}px) rotateY(180deg)`,
                background: scheme.front,
                border: `1px solid ${scheme.border}`,
                opacity: 0.7,
              }}
            />
            
            {/* Right */}
            <div 
              className="absolute rounded-lg"
              style={{ 
                width: size, height: size,
                transform: `translateX(${halfSize}px) rotateY(90deg)`,
                background: scheme.right,
                border: `1px solid ${scheme.border}`,
                filter: isGroupHovered ? 'brightness(1.15)' : 'brightness(1)',
                transition: 'filter 0.4s ease',
              }}
            />
            
            {/* Left */}
            <div 
              className="absolute rounded-lg"
              style={{ 
                width: size, height: size,
                transform: `translateX(-${halfSize}px) rotateY(-90deg)`,
                background: scheme.left,
                border: `1px solid ${scheme.border}`,
                filter: isGroupHovered ? 'brightness(1.1)' : 'brightness(1)',
                transition: 'filter 0.4s ease',
              }}
            />
            
            {/* Top */}
            <div 
              className="absolute rounded-lg"
              style={{ 
                width: size, height: size,
                transform: `translateY(-${halfSize}px) rotateX(90deg)`,
                background: scheme.top,
                border: `1px solid ${scheme.border}`,
                filter: isGroupHovered ? 'brightness(1.2)' : 'brightness(1)',
                transition: 'filter 0.4s ease',
              }}
            />
            
            {/* Bottom */}
            <div 
              className="absolute rounded-lg"
              style={{ 
                width: size, height: size,
                transform: `translateY(${halfSize}px) rotateX(-90deg)`,
                background: scheme.front,
                border: `1px solid ${scheme.border}`,
                opacity: 0.5,
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// 5 cubes in dynamic cluster - larger sizes, more movement
const cubesConfig = [
  // Main large cube - center focus
  { size: 95, position: { x: 72, y: 35 }, delay: 0.1, duration: 5, colorScheme: 'purple' as const, floatRange: 18, driftX: 12 },
  // Secondary cubes
  { size: 75, position: { x: 62, y: 50 }, delay: 0.2, duration: 6, colorScheme: 'pink' as const, floatRange: 22, driftX: -15 },
  { size: 70, position: { x: 82, y: 48 }, delay: 0.15, duration: 7, colorScheme: 'blue' as const, floatRange: 16, driftX: 10 },
  // Smaller accent cubes
  { size: 55, position: { x: 68, y: 65 }, delay: 0.25, duration: 5.5, colorScheme: 'gold' as const, floatRange: 20, driftX: -8 },
  { size: 50, position: { x: 85, y: 28 }, delay: 0.3, duration: 6.5, colorScheme: 'pink' as const, floatRange: 14, driftX: 6 },
];

export const HeroSection: React.FC = () => {
  const [isGroupHovered, setIsGroupHovered] = useState(false);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: '#050508' }}
    >
      {/* Main gradient background - Strong purple glow from bottom-left corner */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 150% 120% at -10% 120%, rgba(147, 51, 234, 0.9) 0%, rgba(126, 34, 206, 0.7) 15%, rgba(88, 28, 135, 0.4) 35%, rgba(59, 28, 100, 0.2) 50%, transparent 65%),
            radial-gradient(ellipse 100% 100% at 0% 60%, rgba(139, 92, 246, 0.35) 0%, rgba(88, 28, 135, 0.15) 40%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 0% 20%, rgba(147, 51, 234, 0.2) 0%, transparent 50%),
            linear-gradient(180deg, #050508 0%, #08080d 50%, #0a0a12 100%)
          `,
        }}
      />

      {/* Strong purple ambient glow - animated */}
      <motion.div 
        className="absolute bottom-0 left-0 w-[80%] h-[90%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 90% at 0% 100%, rgba(147, 51, 234, 0.4) 0%, rgba(126, 34, 206, 0.2) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ 
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Extended fade to next section */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #0a0a12 100%)',
        }}
      />

      {/* Subtle vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* 3D Cubes cluster - Desktop */}
      <div className="absolute inset-0 hidden md:block">
        {cubesConfig.map((cube, index) => (
          <HolographicCube 
            key={index} 
            {...cube} 
            isGroupHovered={isGroupHovered}
          />
        ))}
        {/* Hitbox covering cube cluster area - tight to cube positions */}
        <div
          className="absolute cursor-pointer"
          style={{
            left: '60%',
            top: '28%',
            width: '28%',
            height: '42%',
            zIndex: 50,
            // Debug: uncomment to see hitbox
            // background: 'rgba(255,0,0,0.2)',
          }}
          onMouseEnter={() => setIsGroupHovered(true)}
          onMouseLeave={() => setIsGroupHovered(false)}
        />
      </div>

      {/* Content - Left aligned */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <motion.div
          className="max-w-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-3 mb-5"
            variants={itemVariants}
          >
            <span className="px-3 py-1.5 text-xs font-semibold bg-accent-500/20 text-accent-300 rounded-full border border-accent-500/30">
              Open to Work
            </span>
            <span className="text-gray-400 text-sm">Available for freelance projects</span>
          </motion.div>

          {/* Main heading - Balanced size */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-6"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Aga
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Putra
            </span>
          </motion.h1>

          {/* Role/Title */}
          <motion.p
            className="text-gray-200 text-lg md:text-xl font-medium mb-3"
            variants={itemVariants}
          >
            {personalData.title}
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-md"
            variants={itemVariants}
          >
            {personalData.bio}
          </motion.p>

          {/* CTA Button - Download CV */}
          <motion.div variants={itemVariants}>
            <motion.a
              href="/documents/cv.pdf"
              download="CV_Aga_Putra.pdf"
              className="group inline-flex items-center gap-3 px-6 py-3.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white font-medium hover:bg-white/10 hover:border-accent-500/50"
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
              style={{ transition: 'background-color 0.3s, border-color 0.3s' }}
            >
              Download CV
              <span className="flex items-center justify-center w-8 h-8 bg-accent-500 rounded-full transition-transform duration-300">
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16" />
                </svg>
              </span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - wrapped in container for proper centering */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <ScrollIndicator onClick={() => scrollToSection('expertise')} />
        </div>
      </div>

      {/* Bottom fade to ensure smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
    </section>
  );
};

