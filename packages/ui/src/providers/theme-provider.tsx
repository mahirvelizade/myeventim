'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Theme } from '@invitely/types';

interface ThemeContextValue {
  theme: Theme;
  effective: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'SYSTEM';
  return (localStorage.getItem('invitely-theme') as Theme) ?? 'SYSTEM';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);
  const [effective, setEffective] = useState<'light' | 'dark'>(() => {
    const stored = getStoredTheme();
    return stored === 'SYSTEM' ? getSystemTheme() : stored.toLowerCase() as 'light' | 'dark';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('invitely-theme', newTheme);
  };

  useEffect(() => {
    const resolved = theme === 'SYSTEM' ? getSystemTheme() : theme.toLowerCase() as 'light' | 'dark';
    setEffective(resolved);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'SYSTEM') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const sys = getSystemTheme();
      setEffective(sys);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(sys);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, effective, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
