export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function isMobile(): boolean {
  if (!isBrowser()) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export function isIOS(): boolean {
  if (!isBrowser()) return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  if (!isBrowser()) return false;
  return /Android/i.test(navigator.userAgent);
}

export function isTelegramWebApp(): boolean {
  if (!isBrowser()) return false;
  return typeof (window as Record<string, unknown>).TelegramWebviewProxy !== 'undefined'
    || !!window.navigator.userAgent.match(/Telegram/i);
}

export function getTelegramPlatform(): string | null {
  if (!isBrowser()) return null;
  return window.navigator.userAgent.match(/Telegram\/([\d.]+)/i)?.[1] ?? null;
}
