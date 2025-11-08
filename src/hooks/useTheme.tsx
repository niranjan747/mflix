// Custom hook for theme management with localStorage persistence
// Based on data-model.md Theme specification and research.md decisions

import { useState, useEffect } from 'react';
import type { Theme } from '../types/movie';

/**
 * Custom hook for managing light/dark theme with localStorage persistence
 * @returns Current theme and toggleTheme function
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (storedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      // Default to light theme
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  /**
   * Toggle between light and dark themes
   */
  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update DOM class for Tailwind dark mode
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    theme,
    toggleTheme,
  };
}
