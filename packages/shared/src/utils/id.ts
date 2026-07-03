function bytesToBase64(bytes: Uint8Array): string {
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  for (let i = 0; i < bytes.length; i++) {
    result += chars[bytes[i]! % 64];
  }
  return result;
}

function randomBytes(length: number): Uint8Array {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint8Array(length));
  }
  const arr = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    arr[i] = Math.floor(Math.random() * 256);
  }
  return arr;
}

export function generateId(length = 24): string {
  return bytesToBase64(randomBytes(length)).slice(0, length);
}

export function generateShortId(length = 8): string {
  return bytesToBase64(randomBytes(length)).slice(0, length);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 100);
}

export function generateNumericId(length = 10): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}
