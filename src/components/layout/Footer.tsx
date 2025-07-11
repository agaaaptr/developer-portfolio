import React from 'react';
import personalData from '@/data/personal.json';

export const Footer: React.FC = () => (
  <footer className="py-8 px-4 bg-secondary-900 border-t border-secondary-800">
    <div className="max-w-6xl mx-auto text-center text-secondary-400">
      <p>© 2025 {personalData.name}. Built with React, Next.js, and Tailwind CSS.</p>
    </div>
  </footer>
);