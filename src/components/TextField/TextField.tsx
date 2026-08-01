"use client";

import { useId } from "react";

import styles from "./TextField.module.scss";

export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  multiline?: boolean;
  rows?: number;
  error?: string;
  hideLabel?: boolean;
  name?: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
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
  multiline = false,
  rows = 4,
  error,
  hideLabel = false,
  name,
  id,
  value,
  defaultValue,
  disabled,
  autoComplete,
  className,
  onChange,
  onBlur,
  ref,
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  const controlClassName = [styles.control, styles[size], error ? styles.invalid : ""]
    .filter(Boolean)
    .join(" ");

  const sharedProps = {
    id: fieldId,
    name,
    placeholder,
    disabled,
    value,
    defaultValue,
    onChange,
    onBlur,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: controlClassName,
  };

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
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

      {multiline ? (
        <textarea {...sharedProps} rows={rows} ref={ref as React.Ref<HTMLTextAreaElement>} />
      ) : (
        <input
          {...sharedProps}
          type="text"
          autoComplete={autoComplete}
          ref={ref as React.Ref<HTMLInputElement>}
        />
      )}

      {error ? (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
