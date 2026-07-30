"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

import Button from "@/components/Button";

import styles from "./Modal.module.scss";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  cancelLabel?: string;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: () => void;
  isSubmitDisabled?: boolean;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  cancelLabel,
  submitLabel,
  onCancel,
  onSubmit,
  isSubmitDisabled,
  className,
}: ModalProps) {
  const t = useTranslations("Modal");
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  const handleCancel = onCancel ?? onClose;
  const surfaceClassName = [styles.surface, className].filter(Boolean).join(" ");

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={surfaceClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t("close")}
          >
            &times;
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        <footer className={styles.footer}>
          <Button variant="outline" onClick={handleCancel}>
            {cancelLabel ?? t("cancel")}
          </Button>
          <Button variant="primary" onClick={onSubmit} disabled={isSubmitDisabled}>
            {submitLabel ?? t("submit")}
          </Button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
