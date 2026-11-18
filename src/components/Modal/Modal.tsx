"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useLayoutEffect, useRef } from "react";

import Button from "@/components/Button";

import styles from "./Modal.module.scss";

const TABBABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getTabbableElements(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)].filter((element) => {
    if (element.tabIndex < 0 || element.hasAttribute("disabled")) return false;

    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleCancel = onCancel ?? onClose;
  const surfaceClassName = [styles.surface, className].filter(Boolean).join(" ");

  const handleDialogCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    // Keep React state in charge. Otherwise the browser closes the dialog while
    // isOpen is still true and the effect opens it again.
    event.preventDefault();
    onClose();
  };

  const handleBackdropMouseDown = (event: React.MouseEvent<HTMLDialogElement>) => {
    // A pointer down on the dialog focuses it and then steals focus back after close().
    if (event.target === event.currentTarget) event.preventDefault();
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab" || event.defaultPrevented) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    // Chrome still moves focus to <body> when Tab wraps at the edge of a
    // modal dialog, so cycle it ourselves.
    const tabbable = getTabbableElements(dialog);
    if (tabbable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = tabbable[0];
    const last = tabbable[tabbable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby={isOpen ? titleId : undefined}
      onCancel={handleDialogCancel}
      onMouseDown={handleBackdropMouseDown}
      onClick={handleBackdropClick}
      onKeyDown={handleDialogKeyDown}
    >
      {isOpen ? (
        <div className={surfaceClassName} onClick={(event) => event.stopPropagation()}>
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
      ) : null}
    </dialog>
  );
}
