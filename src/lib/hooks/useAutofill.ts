'use client';

import { useEffect, useRef } from 'react';

export const useAutofill = <T extends HTMLInputElement | HTMLTextAreaElement>() => {
  const inputRef = useRef<T>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const applyAutofillStyles = () => {
      input.style.setProperty('background-color', '#2d3748', 'important');
      input.style.setProperty('color', '#ffffff', 'important');
      input.style.setProperty('-webkit-text-fill-color', '#ffffff', 'important');
      input.style.setProperty('caret-color', '#ffffff', 'important');
      input.style.setProperty('box-shadow', '0 0 0px 1000px #2d3748 inset', 'important');
      input.style.setProperty('background-image', 'none', 'important');
    };

    const removeAutofillStyles = () => {
      input.style.removeProperty('background-color');
      input.style.removeProperty('color');
      input.style.removeProperty('-webkit-text-fill-color');
      input.style.removeProperty('caret-color');
      input.style.removeProperty('box-shadow');
      input.style.removeProperty('background-image');
    };

    const checkAutofill = () => {
      if (input.matches(':-webkit-autofill')) {
        applyAutofillStyles();
      } else {
        removeAutofillStyles();
      }
    };

    // 1. Listen for animationstart event (triggered by autofill in some browsers)
    input.addEventListener('animationstart', applyAutofillStyles);

    // 2. Use MutationObserver to detect style/attribute changes (more robust)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          checkAutofill();
        }
      });
    });
    observer.observe(input, { attributes: true });

    // 3. Initial check on mount
    checkAutofill();

    // 4. Fallback polling (less ideal but sometimes necessary for stubborn cases)
    const intervalId = setInterval(checkAutofill, 500); // Check every 500ms

    return () => {
      input.removeEventListener('animationstart', applyAutofillStyles);
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  return inputRef;
};
