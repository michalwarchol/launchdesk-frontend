"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import styles from "./Autocomplete.module.scss";

interface AutocompleteBaseProps<T> {
  options: T[];
  getOptionLabel: (option: T) => string;
  getOptionKey: (option: T) => string;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  renderOption?: (option: T) => React.ReactNode;
  renderValue?: (option: T) => React.ReactNode;
  label?: string;
  placeholder?: string;
  error?: string;
  hideLabel?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  id?: string;
  name?: string;
  className?: string;
  onBlur?: () => void;
}

type SingleAutocompleteProps<T> = {
  multiple?: false;
  value: T | null;
  onChange: (value: T | null) => void;
};

type MultiAutocompleteProps<T> = {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
};

export type AutocompleteProps<T> = AutocompleteBaseProps<T> &
  (SingleAutocompleteProps<T> | MultiAutocompleteProps<T>);

export default function Autocomplete<T>({
  options,
  getOptionLabel,
  getOptionKey,
  inputValue,
  onInputValueChange,
  renderOption,
  renderValue,
  label,
  placeholder,
  error,
  hideLabel = false,
  disabled,
  isLoading,
  id,
  name,
  className,
  onBlur,
  multiple,
  value,
  onChange,
}: AutocompleteProps<T>) {
  const t = useTranslations("Autocomplete");
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const listboxId = `${fieldId}-listbox`;

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedValues: T[] = multiple ? value : value ? [value] : [];
  const selectedKeys = new Set(selectedValues.map((option) => getOptionKey(option)));
  const visibleOptions = options.filter((option) => !selectedKeys.has(getOptionKey(option)));

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target || !rootRef.current) return;

      // Selecting an option re-renders the list and detaches the clicked node, so a
      // disconnected target means the click came from inside, not outside.
      if (!target.isConnected) return;

      if (!rootRef.current.contains(target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handlePointerDown, true);
    return () => document.removeEventListener("mousedown", handlePointerDown, true);
  }, [isOpen]);

  const clampedActiveIndex =
    activeIndex >= visibleOptions.length ? visibleOptions.length - 1 : activeIndex;

  const openList = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  const closeList = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const selectOption = (option: T) => {
    if (multiple) {
      onChange([...selectedValues, option]);
      onInputValueChange("");
      setActiveIndex(-1);
      inputRef.current?.focus();
      return;
    }

    onChange(option);
    onInputValueChange("");
    closeList();
    inputRef.current?.focus();
  };

  const removeValue = (option: T) => {
    if (!multiple) {
      onChange(null);
      return;
    }

    onChange(selectedValues.filter((selected) => getOptionKey(selected) !== getOptionKey(option)));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!multiple && value) {
      onChange(null);
    }

    onInputValueChange(event.target.value);
    setActiveIndex(-1);
    openList();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        openList();
        return;
      }
      setActiveIndex((previous) => (previous + 1 >= visibleOptions.length ? 0 : previous + 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        openList();
        return;
      }
      setActiveIndex((previous) => (previous - 1 < 0 ? visibleOptions.length - 1 : previous - 1));
      return;
    }

    if (event.key === "Home") {
      if (!isOpen) return;
      event.preventDefault();
      setActiveIndex(visibleOptions.length > 0 ? 0 : -1);
      return;
    }

    if (event.key === "End") {
      if (!isOpen) return;
      event.preventDefault();
      setActiveIndex(visibleOptions.length > 0 ? visibleOptions.length - 1 : -1);
      return;
    }

    if (event.key === "Enter") {
      if (!isOpen || clampedActiveIndex < 0) return;
      event.preventDefault();
      const option = visibleOptions[clampedActiveIndex];
      if (option) selectOption(option);
      return;
    }

    if (event.key === "Escape") {
      if (!isOpen) return;
      event.preventDefault();
      closeList();
      return;
    }

    if (event.key === "Backspace" && inputValue === "" && multiple && selectedValues.length > 0) {
      removeValue(selectedValues[selectedValues.length - 1]);
    }
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const handleControlMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (event.target !== inputRef.current) {
      event.preventDefault();
      inputRef.current?.focus();
    }

    openList();
  };

  const inputDisplayValue = !multiple && value ? getOptionLabel(value) : inputValue;

  const controlClassName = [
    styles.control,
    error ? styles.invalid : "",
    disabled ? styles.disabled : "",
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

      <div className={controlClassName} onMouseDown={handleControlMouseDown}>
        {multiple && selectedValues.length > 0 ? (
          <ul className={styles.chips}>
            {selectedValues.map((option) => (
              <li key={getOptionKey(option)} className={styles.chip}>
                <span className={styles.chipContent}>
                  {renderValue ? renderValue(option) : getOptionLabel(option)}
                </span>
                <button
                  type="button"
                  className={styles.chipRemove}
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => removeValue(option)}
                  disabled={disabled}
                  aria-label={t("removeOption", { name: getOptionLabel(option) })}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <input
          ref={inputRef}
          id={fieldId}
          name={name}
          type="text"
          role="combobox"
          className={styles.input}
          placeholder={placeholder}
          value={inputDisplayValue}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={openList}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-activedescendant={
            isOpen && clampedActiveIndex >= 0
              ? `${listboxId}-option-${clampedActiveIndex}`
              : undefined
          }
        />

        {!multiple && value ? (
          <button
            type="button"
            className={styles.clearButton}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={() => removeValue(value)}
            disabled={disabled}
            aria-label={t("clear")}
          >
            &times;
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <ul id={listboxId} role="listbox" className={styles.listbox}>
          {isLoading ? (
            <li className={styles.status}>{t("loading")}</li>
          ) : visibleOptions.length === 0 ? (
            <li className={styles.status}>{t("noOptions")}</li>
          ) : (
            visibleOptions.map((option, index) => (
              <li
                key={getOptionKey(option)}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={index === clampedActiveIndex}
                className={[styles.option, index === clampedActiveIndex ? styles.optionActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectOption(option);
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {renderOption ? renderOption(option) : getOptionLabel(option)}
              </li>
            ))
          )}
        </ul>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
