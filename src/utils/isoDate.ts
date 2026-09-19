const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Returns the ISO date string for `date` shifted by `days` calendar days. */
export function addDaysISO(date: Date, days: number): string {
  const next = new Date(date);
  next.setDate(next.getDate() + days);

  return toISODate(next);
}

export function toISODate(date: Date): string {
  const year = `${date.getFullYear()}`.padStart(4, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// `new Date("2026-02-10")` is parsed as UTC midnight, which shifts to the previous day in
// negative offsets, so date-only values are always built from local components instead.
export function parseISODate(value: string | null | undefined): Date | null {
  if (!value || !ISO_DATE_PATTERN.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  // Guards against overflowing values such as "2026-02-31" rolling into March.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return date;
}
