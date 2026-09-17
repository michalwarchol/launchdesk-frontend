export const DAYS_IN_WEEK = 7;
export const WEEKS_IN_GRID = 6;

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDayOfTargetMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();

  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(date.getDate(), lastDayOfTargetMonth),
  );
}

export function startOfWeek(date: Date, weekStartsOn: number): Date {
  const offset = (date.getDay() - weekStartsOn + DAYS_IN_WEEK) % DAYS_IN_WEEK;

  return addDays(date, -offset);
}

export function endOfWeek(date: Date, weekStartsOn: number): Date {
  return addDays(startOfWeek(date, weekStartsOn), DAYS_IN_WEEK - 1);
}

export function getMonthGrid(year: number, month: number, weekStartsOn: number): Date[] {
  const firstVisibleDay = startOfWeek(new Date(year, month, 1), weekStartsOn);

  return Array.from({ length: WEEKS_IN_GRID * DAYS_IN_WEEK }, (_, index) =>
    addDays(firstVisibleDay, index),
  );
}

export function clampToRange(date: Date, min: Date | null, max: Date | null): Date {
  if (min && date < min) return min;
  if (max && date > max) return max;

  return date;
}

export function isWithinRange(date: Date, min: Date | null, max: Date | null): boolean {
  if (min && date < min) return false;
  if (max && date > max) return false;

  return true;
}
