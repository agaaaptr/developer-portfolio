import React from 'react';
import { Button } from '@/components/ui/Button';
import { Code2 } from 'lucide-react';

export const Header: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-secondary-900/80 backdrop-blur-md border-b border-secondary-700/50 py-4 px-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Code2 className="h-8 w-8 text-primary-400" />
        <span className="text-xl font-bold text-white">Portfolio</span>
      </div>
      <Button
        onClick={() => window.open('/cv.pdf', '_blank')}
        className="bg-transparent border border-primary-400 text-primary-400 px-8 py-3 rounded-full font-semibold hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors"
      >
        Download CV
      </Button>
    </div>
  </header>
);