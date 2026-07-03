export function formatDate(date: Date | string, locale = 'az'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string, locale = 'az'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date: Date | string, locale = 'az'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(d, locale)} ${formatTime(d, locale)}`;
}

export function isExpired(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getTime() < Date.now();
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = Date.now();
  const diff = now - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} gün əvvəl`;
  if (hours > 0) return `${hours} saat əvvəl`;
  if (minutes > 0) return `${minutes} dəqiqə əvvəl`;
  return 'az əvvəl';
}
