'use client';

import React from 'react';
import { useTouchDevice } from '@/lib/hooks/useTouchDevice';

interface BodyWrapperProps {
  children: React.ReactNode;
}

export const BodyWrapper: React.FC<BodyWrapperProps> = ({ children }) => {
  const isTouchDevice = useTouchDevice();

  return (
    <body className={isTouchDevice ? 'touch-device' : ''}>
      {children}
    </body>
  );
};
