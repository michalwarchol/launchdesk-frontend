"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { parseISODate, toISODate } from "@/utils/isoDate";

import {
  addDays,
  addMonths,
  clampToRange,
  DAYS_IN_WEEK,
  endOfWeek,
  getMonthGrid,
  isSameDay,
  isSameMonth,
  isWithinRange,
  startOfWeek,
} from "./calendar";
import styles from "./DatePicker.module.scss";

export interface DatePickerProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  id?: string;
  name?: string;
  className?: string;
  onBlur?: () => void;
}

type LocaleWithWeekInfo = Intl.Locale & {
  weekInfo?: { firstDay: number };
  getWeekInfo?: () => { firstDay: number };
};

// `weekInfo` reports 1 (Monday) through 7 (Sunday) while `Date#getDay` uses 0 (Sunday) through 6.
function getWeekStartsOn(locale: string): number {
  try {
    const resolved = new Intl.Locale(locale) as LocaleWithWeekInfo;
    const firstDay = resolved.getWeekInfo?.().firstDay ?? resolved.weekInfo?.firstDay;

    if (typeof firstDay === "number") return firstDay % DAYS_IN_WEEK;
  } catch {
    // Unsupported locale or engine without week info, fall back to the ISO default.
  }

  return 1;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default function DatePicker({
  value,
  onChange,
  label,
  placeholder,
  error,
  hideLabel = false,
  disabled,
  min,
  max,
  id,
  name,
  className,
  onBlur,
}: DatePickerProps) {
  const t = useTranslations("DatePicker");
  const locale = useLocale();
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const dialogId = `${fieldId}-dialog`;
  const monthLabelId = `${fieldId}-month`;

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  // Clicking the month arrows also moves the focused day, but stealing focus from the arrow
  // would stop the user from paging through several months in a row.
  const shouldFocusDayRef = useRef(false);

  const selectedDate = parseISODate(value);
  const minDate = parseISODate(min);
  const maxDate = parseISODate(max);

  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate ?? new Date()));
  const [focusedDate, setFocusedDate] = useState(() => selectedDate ?? new Date());

  const weekStartsOn = useMemo(() => getWeekStartsOn(locale), [locale]);

  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    // 2024-01-01 was a Monday, so any week start lands inside a stable reference week.
    const firstWeekday = startOfWeek(new Date(2024, 0, 1), weekStartsOn);

    return Array.from({ length: DAYS_IN_WEEK }, (_, index) =>
      formatter.format(addDays(firstWeekday, index)),
    );
  }, [locale, weekStartsOn]);

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale],
  );
  const triggerFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale],
  );
  const dayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
    [locale],
  );

  const weeks = useMemo(() => {
    const days = getMonthGrid(visibleMonth.getFullYear(), visibleMonth.getMonth(), weekStartsOn);

    return Array.from({ length: days.length / DAYS_IN_WEEK }, (_, index) =>
      days.slice(index * DAYS_IN_WEEK, (index + 1) * DAYS_IN_WEEK),
    );
  }, [visibleMonth, weekStartsOn]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target || !rootRef.current) return;

      // Picking a day re-renders the grid and detaches the clicked node, so a
      // disconnected target means the click came from inside, not outside.
      if (!target.isConnected) return;

      if (!rootRef.current.contains(target)) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    document.addEventListener("mousedown", handlePointerDown, true);
    return () => document.removeEventListener("mousedown", handlePointerDown, true);
  }, [isOpen, onBlur]);

  useEffect(() => {
    if (!isOpen || !shouldFocusDayRef.current) return;

    shouldFocusDayRef.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('[data-focused="true"]')?.focus();
  }, [isOpen, focusedDate]);

  const openCalendar = () => {
    if (disabled) return;

    const initial = clampToRange(selectedDate ?? new Date(), minDate, maxDate);
    shouldFocusDayRef.current = true;
    setFocusedDate(initial);
    setVisibleMonth(startOfMonth(initial));
    setIsOpen(true);
  };

  const closeCalendar = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
    onBlur?.();
  };

  const selectDate = (date: Date) => {
    onChange(toISODate(date));
    setIsOpen(false);
    triggerRef.current?.focus();
    onBlur?.();
  };

  const goToMonth = (amount: number) => {
    const nextMonth = addMonths(visibleMonth, amount);
    setVisibleMonth(startOfMonth(nextMonth));
    setFocusedDate(clampToRange(addMonths(focusedDate, amount), minDate, maxDate));
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openCalendar();
    }
  };

  const handleGridKeyDown = (event: React.KeyboardEvent<HTMLTableElement>) => {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focusedDate, -1),
      ArrowRight: () => addDays(focusedDate, 1),
      ArrowUp: () => addDays(focusedDate, -DAYS_IN_WEEK),
      ArrowDown: () => addDays(focusedDate, DAYS_IN_WEEK),
      Home: () => startOfWeek(focusedDate, weekStartsOn),
      End: () => endOfWeek(focusedDate, weekStartsOn),
      PageUp: () => addMonths(focusedDate, -1),
      PageDown: () => addMonths(focusedDate, 1),
    };

    const move = moves[event.key];
    if (!move) return;

    event.preventDefault();
    const next = clampToRange(move(), minDate, maxDate);
    shouldFocusDayRef.current = true;
    setFocusedDate(next);
    setVisibleMonth(startOfMonth(next));
  };

  const handleRootKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || !isOpen) return;

    event.preventDefault();
    closeCalendar();
  };

  const controlClassName = [
    styles.control,
    error ? styles.invalid : "",
    disabled ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  // The last day of the previous month and the first day of the next one.
  const isPreviousMonthDisabled = Boolean(minDate && addDays(visibleMonth, -1) < minDate);
  const isNextMonthDisabled = Boolean(
    maxDate && startOfMonth(addMonths(visibleMonth, 1)) > maxDate,
  );

  return (
    <div
      ref={rootRef}
      className={[styles.field, className].filter(Boolean).join(" ")}
      onKeyDown={handleRootKeyDown}
    >
      {label ? (
        <label
          htmlFor={fieldId}
          className={[styles.label, hideLabel ? styles.visuallyHidden : ""]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
        </label>
      ) : null}

      <div className={controlClassName}>
        <button
          ref={triggerRef}
          id={fieldId}
          type="button"
          className={[styles.trigger, selectedDate ? "" : styles.triggerPlaceholder]
            .filter(Boolean)
            .join(" ")}
          disabled={disabled}
          onClick={() => (isOpen ? closeCalendar() : openCalendar())}
          onKeyDown={handleTriggerKeyDown}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? dialogId : undefined}
          aria-describedby={error ? errorId : undefined}
        >
          {selectedDate ? triggerFormatter.format(selectedDate) : (placeholder ?? t("empty"))}
        </button>

        {selectedDate ? (
          <button
            type="button"
            className={styles.clearButton}
            disabled={disabled}
            onClick={() => {
              onChange(null);
              onBlur?.();
            }}
            aria-label={t("clear")}
          >
            &times;
          </button>
        ) : null}
      </div>

      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}

      {isOpen ? (
        <div
          id={dialogId}
          role="dialog"
          aria-modal={false}
          aria-labelledby={monthLabelId}
          className={styles.popover}
        >
          <header className={styles.header}>
            <button
              type="button"
              className={styles.navButton}
              disabled={isPreviousMonthDisabled}
              onClick={() => goToMonth(-1)}
              aria-label={t("previousMonth")}
            >
              &lsaquo;
            </button>
            <span id={monthLabelId} className={styles.monthLabel} aria-live="polite">
              {monthFormatter.format(visibleMonth)}
            </span>
            <button
              type="button"
              className={styles.navButton}
              disabled={isNextMonthDisabled}
              onClick={() => goToMonth(1)}
              aria-label={t("nextMonth")}
            >
              &rsaquo;
            </button>
          </header>

          <table ref={gridRef} role="grid" className={styles.grid} onKeyDown={handleGridKeyDown}>
            <thead>
              <tr>
                {weekdayLabels.map((weekday) => (
                  <th key={weekday} scope="col" className={styles.weekday}>
                    {weekday}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={toISODate(week[0])}>
                  {week.map((day) => {
                    const isOutsideMonth = !isSameMonth(day, visibleMonth);
                    const isSelected = Boolean(selectedDate && isSameDay(day, selectedDate));
                    const isToday = isSameDay(day, new Date());
                    const isDisabled = !isWithinRange(day, minDate, maxDate);

                    const dayClassName = [
                      styles.day,
                      isOutsideMonth ? styles.dayOutside : "",
                      isSelected ? styles.daySelected : "",
                      isToday ? styles.dayToday : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <td
                        key={toISODate(day)}
                        role="gridcell"
                        aria-selected={isSelected}
                        className={styles.dayCell}
                      >
                        <button
                          type="button"
                          className={dayClassName}
                          disabled={isDisabled}
                          data-focused={isSameDay(day, focusedDate) ? "true" : undefined}
                          tabIndex={isSameDay(day, focusedDate) ? 0 : -1}
                          onClick={() => selectDate(day)}
                          aria-label={dayFormatter.format(day)}
                          aria-current={isToday ? "date" : undefined}
                        >
                          {day.getDate()}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
