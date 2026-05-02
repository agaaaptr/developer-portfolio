"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowUpRight } from 'lucide-react';
import personalData from '@/data/personal.json';
import { SectionGridBackground } from '@/components/ui/SectionGridBackground';

// Simple SVG icons for social media
const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    try {
      const response = await fetch('https://getform.io/f/bqomlpob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send message.');
        setStatus('error');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('An unexpected error occurred.');
      setStatus('error');
    }
  };

  const socials = [
    { 
      name: 'GitHub', 
      url: `https://github.com/${personalData.socials.github}`, 
      icon: GithubIcon,
      label: 'Github'
    },
    { 
      name: 'LinkedIn', 
      url: `https://linkedin.com/in/${personalData.socials.linkedin}`, 
      icon: LinkedinIcon,
      label: 'LinkedIn'
    },
    { 
      name: 'Instagram', 
      url: `https://instagram.com/${personalData.socials.instagram}`, 
      icon: InstagramIcon,
      label: 'Instagram'
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-8 md:py-12 bg-dark-900 overflow-hidden"
    >
      <SectionGridBackground />

      {/* Bottom center purple glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[80%] pointer-events-none">
        <motion.div
          className="h-full w-full"
          style={{
            background: 'radial-gradient(ellipse 82% 64% at 50% 100%, rgba(147, 51, 234, 0.75) 0%, rgba(126, 34, 206, 0.5) 24%, rgba(88, 28, 135, 0.24) 48%, transparent 72%)',
            filter: 'blur(46px)',
          }}
          animate={{
            opacity: [0.72, 1, 0.72],
            scaleX: [0.88, 1.18, 0.88],
            scaleY: [0.94, 1.08, 0.94],
            y: [0, -12, 0],
            filter: ['blur(40px)', 'blur(54px)', 'blur(40px)'],
          }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Secondary purple ambient glow - animated */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[60%] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom center, rgba(168, 85, 247, 0.35) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        animate={{ 
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16">
          {/* Left side - Contact Info */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                Available for select<br />
                <span className="text-accent-400">freelance opportunities</span>
              </h2>
              <p className="text-gray-400 font-mono text-xs sm:text-sm md:text-base leading-relaxed">
                Have an exciting project you need<br className="hidden sm:block" />
                help with?<br className="hidden sm:block" />
                Send me an email or contact me via<br className="hidden sm:block" />
                instant message!
              </p>
            </motion.div>

            {/* Email link with fill-up hover effect */}
            <motion.a
              href={`mailto:${personalData.email}`}
              className="group relative inline-block font-mono text-sm sm:text-base md:text-lg lg:text-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                {personalData.email}
              </span>
              {/* Purple fill overlay from bottom */}
              <span 
                className="absolute inset-0 bg-accent-500 transform translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0"
                aria-hidden="true"
              />
              {/* Underline */}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-500" />
            </motion.a>

            {/* Social Links - Text style */}
            <motion.div
              className="space-y-2 sm:space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {socials.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-accent-400 transition-colors group text-sm sm:text-base"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <social.icon />
                  <span className="font-mono">{social.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-accent-500/10 border border-accent-500/20"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label htmlFor="name" className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-dark-900/50 border border-gray-700/50 text-white text-sm sm:text-base placeholder-gray-600 focus:outline-none focus:border-accent-500/50 transition-colors"
                placeholder="Your name"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <label htmlFor="email" className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-dark-900/50 border border-gray-700/50 text-white text-sm sm:text-base placeholder-gray-600 focus:outline-none focus:border-accent-500/50 transition-colors"
                placeholder="your@email.com"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <label htmlFor="message" className="block text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-dark-900/50 border border-gray-700/50 text-white text-sm sm:text-base placeholder-gray-600 focus:outline-none focus:border-accent-500/50 transition-colors resize-none sm:rows-5"
                placeholder="Your message..."
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={status === 'sending'}
              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-accent-500 text-dark-900 font-semibold text-sm sm:text-base hover:bg-accent-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: status === 'sending' ? 0 : -2 }}
              whileTap={{ scale: status === 'sending' ? 1 : 0.95 }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.7 },
                y: { type: "spring", stiffness: 300, damping: 25 },
                scale: { type: "spring", stiffness: 300, damping: 25 }
              }}
            >
              {status === 'sending' ? (
                <>
                  <motion.div
                    className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  Send Message
                </>
              )}
            </motion.button>

            {/* Status Messages */}
            <AnimatePresence mode="wait">
              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center text-green-400 text-sm"
                >
                  Message sent successfully! I&apos;ll get back to you soon.
                </motion.p>
              )}
              {status === 'error' && error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center text-red-400 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </section>
  );
};
