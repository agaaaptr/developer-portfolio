'use client';

import React, { useEffect } from 'react';
import { useTouchDevice } from '@/lib/hooks/useTouchDevice';

interface BodyWrapperProps {
  children: React.ReactNode;
}

export const BodyWrapper: React.FC<BodyWrapperProps> = ({ children }) => {
  const isTouchDevice = useTouchDevice();

  useEffect(() => {
    // Add touch-device class to body
    const body = document.body;
    if (isTouchDevice) {
      body.classList.add('touch-device');
    } else {
      body.classList.remove('touch-device');
    }
  }, [isTouchDevice]);

  return <>{children}</>;
};
