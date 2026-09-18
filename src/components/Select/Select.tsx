"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import styles from "./Select.module.scss";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  error?: string;
  hideLabel?: boolean;
  name?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  onBlur?: () => void;
}

/** How long a typed prefix keeps accumulating before it starts a new search. */
const TYPEAHEAD_RESET_MS = 500;

/**
 * The drop direction is decided before the list is rendered, so its height is estimated from the
 * option and padding sizes in `Select.module.scss` rather than measured.
 */
const OPTION_HEIGHT = 37;
const LISTBOX_PADDING = 8;
const LISTBOX_MAX_HEIGHT = 280;
const VIEWPORT_MARGIN = 8;

export default function Select({
  options,
  value,
  onChange,
  label,
  placeholder,
  size = "md",
  error,
  hideLabel = false,
  name,
  id,
  disabled,
  className,
  onBlur,
}: SelectProps) {
  const t = useTranslations("Select");
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const listboxId = `${fieldId}-listbox`;

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const typeaheadRef = useRef({ prefix: "", timeout: 0 });

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropUp, setDropUp] = useState(false);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex === -1 ? undefined : options[selectedIndex];

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target || !rootRef.current) return;

      // Picking an option re-renders the list and detaches the clicked node, so a disconnected
      // target means the click came from inside, not outside.
      if (!target.isConnected) return;

      if (!rootRef.current.contains(target)) setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown, true);
    return () => document.removeEventListener("mousedown", handlePointerDown, true);
  }, [isOpen]);

  // Keyboard navigation is useless in a scrolled list if the highlight moves out of view.
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;

    listboxRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen]);

  useEffect(() => () => window.clearTimeout(typeaheadRef.current.timeout), []);

  /** A field close to the bottom of the viewport has to open upwards to stay visible. */
  const shouldDropUp = () => {
    const button = buttonRef.current;

    if (!button) return false;

    const height = Math.min(LISTBOX_MAX_HEIGHT, options.length * OPTION_HEIGHT + LISTBOX_PADDING);
    const { top, bottom } = button.getBoundingClientRect();
    const spaceBelow = window.innerHeight - bottom;

    return spaceBelow < height + VIEWPORT_MARGIN && top > spaceBelow;
  };

  const openList = (nextActiveIndex = selectedIndex) => {
    if (disabled) return;

    setActiveIndex(nextActiveIndex);
    setDropUp(shouldDropUp());
    setIsOpen(true);
  };

  const closeList = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const selectOption = (option: SelectOption) => {
    onChange?.(option.value);
    closeList();
    buttonRef.current?.focus();
  };

  const moveActiveIndex = (delta: number) => {
    if (options.length === 0) return;

    setActiveIndex((previous) => {
      const next = previous + delta;

      if (next < 0) return options.length - 1;
      if (next >= options.length) return 0;

      return next;
    });
  };

  const runTypeahead = (character: string) => {
    const typeahead = typeaheadRef.current;

    window.clearTimeout(typeahead.timeout);
    typeahead.prefix += character.toLowerCase();
    typeahead.timeout = window.setTimeout(() => {
      typeahead.prefix = "";
    }, TYPEAHEAD_RESET_MS);

    const match = options.findIndex((option) =>
      option.label.toLowerCase().startsWith(typeahead.prefix),
    );

    if (match === -1) return;

    if (isOpen) {
      setActiveIndex(match);

      return;
    }

    selectOption(options[match]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (isOpen) moveActiveIndex(1);
        else openList(selectedIndex === -1 ? 0 : selectedIndex);
        return;

      case "ArrowUp":
        event.preventDefault();
        if (isOpen) moveActiveIndex(-1);
        else openList(selectedIndex === -1 ? options.length - 1 : selectedIndex);
        return;

      case "Home":
        if (!isOpen) return;
        event.preventDefault();
        setActiveIndex(options.length > 0 ? 0 : -1);
        return;

      case "End":
        if (!isOpen) return;
        event.preventDefault();
        setActiveIndex(options.length > 0 ? options.length - 1 : -1);
        return;

      case "Enter":
      case " ": {
        event.preventDefault();

        if (!isOpen) {
          openList();

          return;
        }

        const option = options[activeIndex];
        if (option) selectOption(option);
        return;
      }

      case "Escape":
        if (!isOpen) return;
        event.preventDefault();
        closeList();
        return;

      case "Tab":
        if (isOpen) closeList();
        return;

      default:
        // A single printable character jumps to a matching option, like a native select does.
        if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          runTypeahead(event.key);
        }
    }
  };

  const controlClassName = [
    styles.control,
    styles[size],
    isOpen ? styles.open : "",
    error ? styles.invalid : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={[styles.field, className].filter(Boolean).join(" ")}>
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

      <div className={styles.controlWrapper}>
        <button
          ref={buttonRef}
          id={fieldId}
          type="button"
          role="combobox"
          className={controlClassName}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-activedescendant={
            isOpen && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          onClick={() => (isOpen ? closeList() : openList())}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
        >
          <span className={selectedOption ? styles.value : styles.placeholder}>
            {selectedOption?.label ?? placeholder}
          </span>

          <svg
            className={styles.chevron}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {isOpen ? (
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            className={[styles.listbox, dropUp ? styles.listboxUp : ""].filter(Boolean).join(" ")}
          >
            {options.length === 0 ? (
              <li className={styles.noOptions}>{t("noOptions")}</li>
            ) : (
              options.map((option, index) => {
                const isSelected = option.value === value;

                return (
                  <li
                    key={option.value}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    className={[
                      styles.option,
                      index === activeIndex ? styles.optionActive : "",
                      isSelected ? styles.optionSelected : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectOption(option);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <span>{option.label}</span>

                    <svg
                      className={styles.checkmark}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </li>
                );
              })
            )}
          </ul>
        ) : null}
      </div>

      {/* Keeps the field readable by a plain form submission, since there is no native control. */}
      {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}

      {error ? (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
