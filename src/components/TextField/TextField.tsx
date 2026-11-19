"use client";

import { useId } from "react";

import styles from "./TextField.module.scss";

export interface TextFieldProps {
  label: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  type?: "text" | "email" | "password";
  multiline?: boolean;
  rows?: number;
  error?: string;
  /** Persistent instruction rendered under the field and linked with `aria-describedby`. */
  hint?: string;
  required?: boolean;
  hideLabel?: boolean;
  /** Shows the required asterisk next to the control when the label itself is visually hidden. */
  showRequiredMark?: boolean;
  name?: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  /** Keeps the value in the tab order. Use this instead of `disabled` for values the user can read but not edit. */
  readOnly?: boolean;
  autoComplete?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
}

export default function TextField({
  label,
  placeholder,
  size = "md",
  type = "text",
  multiline = false,
  rows = 4,
  error,
  hint,
  required = false,
  hideLabel = false,
  showRequiredMark = false,
  name,
  id,
  value,
  defaultValue,
  disabled,
  readOnly = false,
  autoComplete,
  className,
  onChange,
  onBlur,
  ref,
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const describedBy = [hint ? hintId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  const controlClassName = [styles.control, styles[size], error ? styles.invalid : ""]
    .filter(Boolean)
    .join(" ");

  const sharedProps = {
    id: fieldId,
    name,
    placeholder,
    disabled,
    readOnly: readOnly || undefined,
    value,
    defaultValue,
    onChange,
    onBlur,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    className: controlClassName,
  };

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      <label
        htmlFor={fieldId}
        className={[styles.label, hideLabel ? styles.visuallyHidden : ""].filter(Boolean).join(" ")}
      >
        {label}
        {required ? (
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <div className={styles.controlRow}>
        {multiline ? (
          <textarea {...sharedProps} rows={rows} ref={ref as React.Ref<HTMLTextAreaElement>} />
        ) : (
          <input
            {...sharedProps}
            type={type}
            autoComplete={autoComplete ?? (disabled ? "off" : undefined)}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        )}
        {showRequiredMark && hideLabel && required ? (
          <span className={styles.requiredMark} aria-hidden="true">
            *
          </span>
        ) : null}
      </div>

      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
