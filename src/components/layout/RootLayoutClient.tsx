'use client';

import React from 'react';
import { Header } from './Header';
import { ScrollToTopButton } from '../ui/ScrollToTopButton';
import { ThemeProvider } from './ThemeProvider';

export const RootLayoutClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="dark">
      <Header />
      {children}
      <ScrollToTopButton />
    </ThemeProvider>
  );
};
