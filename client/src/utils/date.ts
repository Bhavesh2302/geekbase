/**
 * Canonical Date Utilities
 * 
 * Strict date-only semantics:
 * scheduledDate is strictly canonical 'YYYY-MM-DD' without time or timezone offset.
 * We avoid UTC-to-local shifts by never converting date strings blindly via new Date(str).toISOString().
 */

const CANONICAL_DATE_REGEX = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;

export const isValidCanonicalDate = (val: string): boolean => {
  return CANONICAL_DATE_REGEX.test(val);
};

/**
 * Returns today's date in local calendar canonical YYYY-MM-DD format
 */
export const getTodayCanonical = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a Date object to local calendar canonical YYYY-MM-DD
 */
export const formatDateToCanonical = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Safely parses FullCalendar dateStr or ISO string to canonical YYYY-MM-DD
 */
export const extractCanonicalDate = (dateStr: string): string => {
  if (!dateStr) return getTodayCanonical();
  if (CANONICAL_DATE_REGEX.test(dateStr)) return dateStr;
  const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  return getTodayCanonical();
};

/**
 * Formats canonical YYYY-MM-DD into human-readable format e.g. "Wednesday, Oct 15, 2026"
 */
export const formatCanonicalToDisplay = (
  canonicalDate: string,
  variant: 'full' | 'short' | 'month-day' = 'full'
): string => {
  if (!canonicalDate || !CANONICAL_DATE_REGEX.test(canonicalDate)) {
    return canonicalDate || 'Invalid Date';
  }

  const [yearStr, monthStr, dayStr] = canonicalDate.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed
  const day = parseInt(dayStr, 10);

  // Construct local date without UTC conversion
  const dateObj = new Date(year, month, day);

  if (variant === 'short') {
    return dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (variant === 'month-day') {
    return dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }

  return dateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
