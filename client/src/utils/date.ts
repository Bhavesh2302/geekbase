const DATE_REGEX = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;

export const isValidCanonicalDate = (val: string): boolean => DATE_REGEX.test(val);

export const getTodayCanonical = (): string => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export const formatDateToCanonical = (d: Date): string => {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export const extractCanonicalDate = (str: string): string => {
  if (!str) return getTodayCanonical();
  if (DATE_REGEX.test(str)) return str;
  const match = str.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : getTodayCanonical();
};

export const formatCanonicalToDisplay = (
  dateStr: string,
  variant: 'full' | 'short' | 'month-day' = 'full'
): string => {
  if (!dateStr || !DATE_REGEX.test(dateStr)) {
    return dateStr || '';
  }

  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);

  if (variant === 'short') {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (variant === 'month-day') {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }

  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
