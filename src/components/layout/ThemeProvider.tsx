'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isProjectPage = pathname?.startsWith('/project/');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset to dark theme when navigating away from project pages
  useEffect(() => {
    if (mounted && !isProjectPage) {
      setThemeState('dark');
      const root = document.documentElement;
      root.classList.remove('light');
      root.classList.add('dark');
      // Clear localStorage when on main portfolio
      localStorage.removeItem('theme');
    }
  }, [isProjectPage, mounted]);

  // Only load saved theme on project pages
  useEffect(() => {
    if (mounted && isProjectPage) {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        setThemeState(savedTheme);
      }
    }
  }, [mounted, isProjectPage]);

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      // Only save theme preference when on project page
      if (isProjectPage) {
        localStorage.setItem('theme', theme);
      }
    }
  }, [theme, mounted, isProjectPage]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: defaultTheme, toggleTheme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
