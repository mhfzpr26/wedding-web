import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  isValid,
  parseISO,
} from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Parses input string or Date object safely.
 */
function safeParseDate(input: string | Date | null | undefined): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isValid(input) ? input : null;

  try {
    const parsed = parseISO(input);
    if (isValid(parsed)) return parsed;

    const fallback = new Date(input);
    return isValid(fallback) ? fallback : null;
  } catch {
    return null;
  }
}

/**
 * Format date in Indonesian wedding style: "Sabtu, 14 November 2026"
 */
export function formatWeddingDate(
  input: string | Date | null | undefined,
  pattern = 'EEEE, dd MMMM yyyy',
): string {
  const date = safeParseDate(input);
  if (!date) return typeof input === 'string' ? input : '-';

  try {
    return format(date, pattern, { locale: id });
  } catch {
    return String(input);
  }
}

/**
 * Calculate countdown units until target date.
 */
export function calculateCountdown(targetInput: string | Date) {
  const target = safeParseDate(targetInput);
  const now = new Date();

  if (!target || target.getTime() <= now.getTime()) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPassed: true,
    };
  }

  const days = differenceInDays(target, now);
  const hours = differenceInHours(target, now) % 24;
  const minutes = differenceInMinutes(target, now) % 60;
  const seconds = differenceInSeconds(target, now) % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isPassed: false,
  };
}

/**
 * Generate Google Calendar Add-to-Calendar URL
 */
export function generateGoogleCalendarUrl({
  title,
  startDate,
  endDate,
  details,
  location,
}: {
  title: string;
  startDate: string | Date;
  endDate?: string | Date;
  details?: string;
  location?: string;
}): string {
  const start = safeParseDate(startDate);
  if (!start) return '#';

  const end = endDate
    ? safeParseDate(endDate)
    : new Date(start.getTime() + 3 * 60 * 60 * 1000); // default +3h

  const formatUtc = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const startUtc = formatUtc(start);
  const endUtc = formatUtc(end || start);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startUtc}/${endUtc}`,
  });

  if (details) params.set('details', details);
  if (location) params.set('location', location);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
