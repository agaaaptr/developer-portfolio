'use client';

import React, { useState, useEffect } from 'react';
import { LoadingOverlay } from './LoadingOverlay';
import { BackgroundManager } from './BackgroundManager';
import { ReturnToPreviousSectionButton } from '../ui/ReturnToPreviousSectionButton';
import { ScrollToTopButton } from '../ui/ScrollToTopButton';
import { BodyWrapper } from './BodyWrapper';

export const RootLayoutClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Increased delay to ensure loading animation completes

    return () => clearTimeout(timer);
  }, []);

  return (
    <BodyWrapper>
      <LoadingOverlay isLoading={isLoading} />
      <BackgroundManager />
      <div className="animated-pattern-overlay"></div>
      {children}
      <ReturnToPreviousSectionButton />
      <ScrollToTopButton />
    </BodyWrapper>
  );
};
