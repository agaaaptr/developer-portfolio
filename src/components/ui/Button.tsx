import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors ${className}`}
  >
    {children}
  </button>
);