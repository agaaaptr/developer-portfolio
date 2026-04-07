import React from 'react';
import personalData from '@/data/personal.json';

export const Footer: React.FC = () => (
  <footer className="py-6 sm:py-8 px-4 bg-dark-900 border-t border-gray-800/50">
    <div className="max-w-6xl mx-auto text-center text-gray-500">
      <p className="text-xs sm:text-sm font-mono">
        © {new Date().getFullYear()} {personalData.professionalName}. Built with Passion.
      </p>
    </div>
  </footer>
);