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
  if (window.Telegram?.WebApp?.colorScheme) {
    return window.Telegram.WebApp.colorScheme as 'light' | 'dark';
  }
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

    if (window.Telegram?.WebApp?.themeParams) {
      const tp = window.Telegram.WebApp.themeParams;
      if (tp.bg_color) document.documentElement.style.setProperty('--tg-bg', tp.bg_color);
      if (tp.text_color) document.documentElement.style.setProperty('--tg-text', tp.text_color);
      if (tp.button_color) document.documentElement.style.setProperty('--tg-button', tp.button_color);
      if (tp.button_text_color) document.documentElement.style.setProperty('--tg-button-text', tp.button_text_color);
      if (tp.hint_color) document.documentElement.style.setProperty('--tg-hint', tp.hint_color);
      if (tp.link_color) document.documentElement.style.setProperty('--tg-link', tp.link_color);
      if (tp.secondary_bg_color) document.documentElement.style.setProperty('--tg-secondary-bg', tp.secondary_bg_color);
    }
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
