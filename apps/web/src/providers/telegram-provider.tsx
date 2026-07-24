'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

interface TelegramContextValue {
  webApp: WebApp | null;
  user: TelegramUser | null;
  theme: 'light' | 'dark';
  themeParams: Record<string, string>;
  ready: () => void;
  expand: () => void;
  close: () => void;
  showAlert: (message: string) => void;
  hapticFeedback: () => void;
}

interface WebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    start_param?: string;
    auth_date?: string;
    hash?: string;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  showAlert: (message: string) => void;
  HapticFeedback?: {
    impactOccurred: (style: string) => void;
  };
  colorScheme?: string;
  themeParams?: Record<string, string>;
  MainButton: {
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (cb: () => void) => void;
    offClick?: (cb: () => void) => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick?: (cb: () => void) => void;
  };
  version: string;
  platform: string;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

const TelegramContext = createContext<TelegramContextValue | undefined>(undefined);

declare global {
  interface Window {
    Telegram?: {
      WebApp?: WebApp;
    };
  }
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<WebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const app = window.Telegram?.WebApp;
    if (app) {
      setWebApp(app);
      setUser(app.initDataUnsafe?.user ?? null);
    }
  }, []);

  const theme = useMemo<'light' | 'dark'>(
    () => (webApp?.colorScheme === 'dark' ? 'dark' : 'light'),
    [webApp?.colorScheme],
  );

  const themeParams = useMemo<Record<string, string>>(
    () => webApp?.themeParams || {},
    [webApp?.themeParams],
  );

  const ready = useCallback(() => webApp?.ready(), [webApp]);
  const expand = useCallback(() => webApp?.expand(), [webApp]);
  const close = useCallback(() => webApp?.close(), [webApp]);
  const showAlert = useCallback((message: string) => webApp?.showAlert(message), [webApp]);
  const hapticFeedback = useCallback(() => webApp?.HapticFeedback?.impactOccurred('medium'), [webApp]);

  const value = useMemo<TelegramContextValue>(() => ({
    webApp,
    user,
    theme,
    themeParams,
    ready,
    expand,
    close,
    showAlert,
    hapticFeedback,
  }), [webApp, user, theme, themeParams, ready, expand, close, showAlert, hapticFeedback]);

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const ctx = useContext(TelegramContext);
  if (!ctx) throw new Error('useTelegram must be used within TelegramProvider');
  return ctx;
}
