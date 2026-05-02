"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Terminal, PenTool } from 'lucide-react';
import expertiseData from '@/data/expertise.json';
import { SectionGridBackground } from '@/components/ui/SectionGridBackground';

const iconMap: Record<string, React.ElementType> = {
  monitor: Monitor,
  terminal: Terminal,
  'pen-tool': PenTool,
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
  const Icon = iconMap[expertise.icon] || Monitor;

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

const subtleTitleTextStyle = { color: 'rgba(138, 146, 160, 0.52)' };
const subtleHeadingTextStyle = { color: 'rgba(132, 140, 154, 0.48)' };
const subtleBodyTextStyle = { color: 'rgba(126, 134, 148, 0.44)' };
const subtleBodyMutedTextStyle = { color: 'rgba(122, 130, 144, 0.40)' };
const subtlePipeTextStyle = { color: 'rgba(110, 118, 132, 0.36)' };
const subtlePipeMutedTextStyle = { color: 'rgba(104, 112, 126, 0.32)' };
const subtleAttributeTextStyle = { color: 'rgba(132, 163, 201, 0.62)' };
const subtleStringTextStyle = { color: 'rgba(143, 176, 141, 0.54)' };
const subtlePunctuationTextStyle = { color: 'rgba(154, 162, 176, 0.50)' };

const snippetLines: Array<{ id: string; depth: number; content: React.ReactNode }> = [
  {
    id: 'html-open',
    depth: 0,
    content: (
      <>
        <span className="text-[#b5179e]/55">&lt;html</span>{' '}
        <span style={subtleAttributeTextStyle}>lang</span>
        <span style={subtlePunctuationTextStyle}>=</span>
        <span style={subtleStringTextStyle}>&quot;en&quot;</span>
        <span className="text-[#b5179e]/55">&gt;</span>
      </>
    ),
  },
  {
    id: 'head-open',
    depth: 1,
    content: (
      <>
        <span className="text-[#b5179e]/50">&lt;head&gt;</span>
      </>
    ),
  },
  {
    id: 'meta',
    depth: 2,
    content: (
      <>
        <span className="text-[#b5179e]/45">&lt;meta</span>{' '}
        <span style={subtleAttributeTextStyle}>name</span>
        <span style={subtlePunctuationTextStyle}>=</span>
        <span style={subtleStringTextStyle}>&quot;viewport&quot;</span>{' '}
        <span style={subtleAttributeTextStyle}>content</span>
        <span style={subtlePunctuationTextStyle}>=</span>
        <span style={subtleStringTextStyle}>&quot;width=device-width, initial-scale=1.0&quot;</span>
        <span className="text-[#b5179e]/45">&gt;</span>
      </>
    ),
  },
  {
    id: 'title',
    depth: 2,
    content: (
      <>
        <span className="text-[#b5179e]/45">&lt;title&gt;</span>
        <span style={subtleTitleTextStyle}>What do I do</span>
        <span className="text-[#b5179e]/45">&lt;/title&gt;</span>
      </>
    ),
  },
  {
    id: 'head-close',
    depth: 1,
    content: (
      <>
        <span className="text-[#b5179e]/50">&lt;/head&gt;</span>
      </>
    ),
  },
  {
    id: 'body-open',
    depth: 1,
    content: (
      <>
        <span className="text-[#b5179e]/50">&lt;body&gt;</span>
      </>
    ),
  },
  {
    id: 'h1',
    depth: 2,
    content: (
      <>
        <span className="text-[#b5179e]/45">&lt;h1&gt;</span>
        <span style={subtleHeadingTextStyle}>Things I do to build polished digital products</span>
        <span className="text-[#b5179e]/45">&lt;/h1&gt;</span>
      </>
    ),
  },
  {
    id: 'p',
    depth: 2,
    content: (
      <>
        <span className="text-[#b5179e]/45">&lt;p&gt;</span>
      </>
    ),
  },
  {
    id: 'p-line-frontend',
    depth: 3,
    content: (
      <>
        <span style={subtlePipeTextStyle}>|</span>{' '}
        <span style={subtleBodyTextStyle}>Building responsive interfaces with React, Next.js, and Angular.</span>
      </>
    ),
  },
  {
    id: 'p-line-backend',
    depth: 3,
    content: (
      <>
        <span style={subtlePipeTextStyle}>|</span>{' '}
        <span style={subtleBodyTextStyle}>Shipping scalable APIs with Go, Gin, and MySQL.</span>
      </>
    ),
  },
  {
    id: 'p-close',
    depth: 2,
    content: (
      <>
        <span className="text-[#b5179e]/45">&lt;/p&gt;</span>
      </>
    ),
  },
  {
    id: 'span',
    depth: 2,
    content: (
      <>
        <span className="text-[#b5179e]/45">&lt;span&gt;</span>
      </>
    ),
  },
  {
    id: 'span-line',
    depth: 3,
    content: (
      <>
        <span style={subtlePipeMutedTextStyle}>|</span>{' '}
        <span style={subtleBodyMutedTextStyle}>Adding UI/UX polish with Figma and WordPress across client projects.</span>
      </>
    ),
  },
  {
    id: 'span-close',
    depth: 2,
    content: (
      <>
        <span className="text-[#b5179e]/45">&lt;/span&gt;</span>
      </>
    ),
  },
  {
    id: 'body-close',
    depth: 1,
    content: <span className="text-[#b5179e]/50">&lt;/body&gt;</span>,
  },
  {
    id: 'html-close',
    depth: 0,
    content: <span className="text-[#b5179e]/55">&lt;/html&gt;</span>,
  },
];

const renderSnippetIndentedContent = (depth: number, content: React.ReactNode): React.ReactNode => {
  let node = <>{content}</>;

  for (let index = 0; index < depth; index += 1) {
    node = (
      <div className="ml-3 pl-3 sm:ml-4 sm:pl-4">
        {node}
      </div>
    );
  }

  return node;
};

const HtmlSnippetDecoration: React.FC = () => {
  return (
    <motion.div
      className="pointer-events-none relative w-full max-w-4xl"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.8, duration: 0.7 }}
    >
      <div className="absolute inset-x-24 top-2 h-20 bg-[radial-gradient(circle,rgba(168,85,247,0.12),transparent_74%)] blur-3xl" />
      <div className="relative overflow-hidden px-4 pt-7 opacity-[0.82] sm:px-8 sm:pt-9 md:px-12">
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent" />

        <div className="space-y-0.5 font-mono text-[10px] leading-[1.22] tracking-[0.03em] sm:text-[11px] sm:leading-[1.28] md:text-[12px] md:leading-[1.34]">
          {snippetLines.map((line) => (
            <div key={line.id} className="max-w-3xl whitespace-pre-wrap">
              {renderSnippetIndentedContent(line.depth, line.content)}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const ExpertiseSection: React.FC = () => {
  return (
    <section
      id="expertise"
      className="relative py-8 md:py-12 bg-dark-900 overflow-hidden"
    >
      <SectionGridBackground />

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
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {expertiseData.expertise.map((item, index) => (
            <ExpertiseCard key={item.id} expertise={item} index={index} />
          ))}
        </div>

        <div className="relative z-10 -mt-10 flex justify-center px-4 md:-mt-14 lg:-mt-16">
          <HtmlSnippetDecoration />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent pointer-events-none" />
    </section>
  );
};
