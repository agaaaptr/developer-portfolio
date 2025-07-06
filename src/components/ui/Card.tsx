import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-secondary-800 p-6 rounded-lg border border-secondary-700 ${className}`}>
    {children}
  </div>
);