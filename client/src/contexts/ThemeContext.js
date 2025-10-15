import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, endpoints } from '../utils/api';
import toast from 'react-hot-toast';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      return savedTheme;
    }
    // Default to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [effectiveTheme, setEffectiveTheme] = useState('light');

  // Calculate effective theme (resolve 'auto' to light/dark)
  useEffect(() => {
    if (theme === 'auto') {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setEffectiveTheme(isDark ? 'dark' : 'light');

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        setEffectiveTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  const changeTheme = async (newTheme) => {
    if (!['light', 'dark', 'auto'].includes(newTheme)) {
      console.error('Invalid theme:', newTheme);
      return;
    }

    try {
      // Update local state and localStorage
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);

      // Update in backend if user is authenticated
      const token = localStorage.getItem('token');
      if (token) {
        await api.put(endpoints.users.updateProfile, {
          themePreference: newTheme
        });
      }
    } catch (error) {
      console.error('Failed to update theme preference:', error);
      // Don't show error to user, theme still works locally
    }
  };

  // Load theme from user profile on mount if authenticated
  useEffect(() => {
    const loadUserTheme = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get(endpoints.users.profile);
          const userTheme = res.data.data.theme_preference;
          if (userTheme && ['light', 'dark', 'auto'].includes(userTheme)) {
            setTheme(userTheme);
            localStorage.setItem('theme', userTheme);
          }
        }
      } catch (error) {
        // Silently fail, use default theme
        console.log('Could not load user theme preference');
      }
    };

    loadUserTheme();
  }, []);

  const value = {
    theme, // Current theme setting (light/dark/auto)
    effectiveTheme, // Resolved theme (light/dark)
    changeTheme,
    isDark: effectiveTheme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
