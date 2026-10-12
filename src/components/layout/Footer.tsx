import React from 'react';
import personalData from '@/data/personal.json';

export const Footer: React.FC = () => (
  <footer className="border-t-2 border-ink bg-surface px-4 py-8">
    <div className="mx-auto max-w-6xl text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-ink/60">
        © {new Date().getFullYear()} {personalData.professionalName} · Built with Passion
      </p>
    </div>
  </footer>
);
