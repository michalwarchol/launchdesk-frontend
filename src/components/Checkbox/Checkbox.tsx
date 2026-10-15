"use client";

import { useEffect, useId, useRef } from "react";

import styles from "./Checkbox.module.scss";

export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  ariaLabel?: string;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  ref?: React.Ref<HTMLInputElement>;
}

export default function Checkbox({
  label,
  checked,
  defaultChecked,
  indeterminate = false,
  disabled,
  name,
  id,
  ariaLabel,
  className,
  onChange,
  onBlur,
  onClick,
  ref,
}: CheckboxProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate, checked]);

  const setInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;

    if (node) {
      node.indeterminate = indeterminate;
    }

    if (typeof ref === "function") {
      ref(node);
      return;
    }

    if (ref) {
      ref.current = node;
    }
  };

  const rootClassName = [styles.root, disabled ? styles.disabled : "", className]
    .filter(Boolean)
    .join(" ");

  const control = (
    <span className={styles.control}>
      <input
        ref={setInputRef}
        id={fieldId}
        type="checkbox"
        className={styles.input}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-label={label ? undefined : ariaLabel}
        onChange={onChange}
        onBlur={onBlur}
        onClick={onClick}
      />
      <span className={styles.box} aria-hidden="true">
        <svg
          className={styles.check}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg
          className={styles.dash}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>
    </span>
  );

  if (label) {
    return (
      <label className={rootClassName}>
        {control}
        <span className={styles.label}>{label}</span>
      </label>
    );
  }

  return <span className={rootClassName}>{control}</span>;
}
