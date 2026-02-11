import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number,
  currency: 'MAD' | 'EUR' = 'MAD',
  locale: string = 'fr'
): string {
  const numLocale = locale === 'ar' ? 'ar-MA' : 'fr-MA';
  const formatter = new Intl.NumberFormat(numLocale, {
    style: 'currency',
    currency: currency === 'MAD' ? 'MAD' : 'EUR',
    minimumFractionDigits: currency === 'MAD' ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(price);
}

export function formatDate(date: string, locale: string = 'fr'): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale === 'ar' ? 'ar-MA' : 'fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Error saving to localStorage');
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    console.error('Error removing from localStorage');
  }
}

export function generateSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}
