import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface GradeBadgeStyle {
  bg: string;
  text: string;
  border: string;
  toString: () => string;
}

/**
 * Возвращает оформление для оценок:
 * - 9-10: контрастная светлая подложка
 * - 7-8: матовая серая подложка
 * - 5-6: плотная матовая желтая подложка (без glow)
 * - 1-4: плотная матовая красная подложка (без glow)
 */
export function getGradeBadgeClasses(grade: number): GradeBadgeStyle {
  if (grade >= 9) {
    const s = { bg: 'bg-zinc-200', text: 'text-zinc-950', border: 'border-zinc-300' };
    return { ...s, toString: () => `${s.bg} ${s.text} ${s.border}` };
  }
  if (grade >= 7) {
    const s = { bg: 'bg-zinc-800', text: 'text-zinc-100', border: 'border-zinc-700' };
    return { ...s, toString: () => `${s.bg} ${s.text} ${s.border}` };
  }
  if (grade >= 5) {
    const s = { bg: 'bg-yellow-400', text: 'text-zinc-950', border: 'border-yellow-500' };
    return { ...s, toString: () => `${s.bg} ${s.text} ${s.border}` };
  }
  const s = { bg: 'bg-red-600', text: 'text-white', border: 'border-red-700' };
  return { ...s, toString: () => `${s.bg} ${s.text} ${s.border}` };
}

export function formatDateRu(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}`;
  } catch {
    return dateStr;
  }
}
