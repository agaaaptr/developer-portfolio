import React from 'react';
import { motion } from 'framer-motion';
import { Code, Server } from 'lucide-react';

export const CapabilitiesSection: React.FC = () => {
  return (
    <section id="capabilities" className="py-16 px-4 bg-secondary-900 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-4xl font-bold text-center mb-12 text-primary-400"
        >
          What I Can Do
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-secondary-800 p-8 rounded-lg shadow-lg flex flex-col items-center text-center"
          >
            <Code className="h-16 w-16 text-accent-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Frontend Development</h3>
            <p className="text-secondary-300">
              Crafting engaging and responsive user interfaces with modern web technologies.
              Proficient in React, Next.js, TypeScript, and various styling frameworks like Tailwind CSS.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-secondary-800 p-8 rounded-lg shadow-lg flex flex-col items-center text-center"
          >
            <Server className="h-16 w-16 text-accent-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Backend Development</h3>
            <p className="text-secondary-300">
              Building robust and scalable server-side applications and APIs.
              Experienced with Node.js, Express.js, Python (FastAPI/Django), and database management.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};