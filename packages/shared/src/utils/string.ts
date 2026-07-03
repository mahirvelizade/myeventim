export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  const masked = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  return `${masked}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return phone.slice(0, 3) + '*'.repeat(phone.length - 6) + phone.slice(-3);
}
