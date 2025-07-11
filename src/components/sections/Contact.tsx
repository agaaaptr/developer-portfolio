import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import personalData from '@/data/personal.json';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');
    setError(null);

    try {
      const response = await fetch('https://getform.io/f/bqomlpob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // Important for Getform.io to return JSON
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
        setShowSuccessModal(true); // Show the success modal
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send message.');
        setStatus('Error');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('An unexpected error occurred.');
      setStatus('Error');
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <section id="contact" className="py-16 px-4 bg-secondary-900 text-white">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-4xl font-bold text-center mb-12 text-primary-400"
        >
          Get In Touch
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-secondary-800 p-8 rounded-lg shadow-lg space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary-300 mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-secondary-700 border border-secondary-600 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-300 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-secondary-700 border border-secondary-600 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-secondary-300 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-secondary-700 border border-secondary-600 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              ></textarea>
            </div>
            <Button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Send className="h-5 w-5 mr-2" /> Send Message
            </Button>

            <AnimatePresence mode="wait">
              {status && (
                <motion.p
                  key="status-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center mt-4 text-primary-400"
                >
                  {status}
                </motion.p>
              )}
              {error && (
                <motion.p
                  key="error-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center mt-4 text-red-400"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Contact Info & Socials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-white mb-4">Or reach out directly</h3>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => window.open(`mailto:${personalData.email}`, '_blank')}
                  className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Mail className="h-5 w-5 mr-2" /> Email Me
                </Button>
                <motion.a 
                  href={`https://linkedin.com/in/${personalData.linkedin}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-secondary-800 rounded-full hover:bg-primary-600 transition-colors flex items-center justify-center"
                >
                  <Linkedin className="h-7 w-7 text-white" />
                </motion.a>
                <motion.a 
                  href={`https://github.com/${personalData.github}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-secondary-800 rounded-full hover:bg-primary-600 transition-colors flex items-center justify-center"
                >
                  <Github className="h-7 w-7 text-white" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-gradient-to-br from-secondary-700 to-secondary-900 p-10 rounded-2xl shadow-xl shadow-primary-500/20 text-center max-w-md w-full border border-primary-500/30 relative overflow-hidden"
            >
              <h3 className="text-3xl font-extrabold text-primary-300 mb-4">Message Sent!</h3>
              <p className="text-secondary-200 text-lg mb-8">Thank you for reaching out. I will get back to you as soon as possible.</p>
              <Button
                onClick={closeModal}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-500"
              >
                Close
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};