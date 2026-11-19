"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import { formatFileSize } from "@/utils/formatFileSize";
import { preventFirefoxDisabledRestore } from "@/utils/preventFirefoxDisabledRestore";

import AttachmentPickerModal from "./AttachmentPickerModal";
import styles from "./AttachmentsField.module.scss";
import FileTypeIcon from "./FileTypeIcon";
import { Attachment } from "./types";

export interface AttachmentsFieldProps {
  value: Attachment[];
  onChange: (next: Attachment[]) => void;
  disabled?: boolean;
  className?: string;
  /** Id of a visible label that names this field. */
  ariaLabelledby?: string;
}

export default function AttachmentsField({
  value,
  onChange,
  disabled,
  className,
  ariaLabelledby,
}: AttachmentsFieldProps) {
  const t = useTranslations("Attachments");
  const addButtonId = useId();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const removeButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pendingFocusIndex = useRef<number | null>(null);

  useEffect(() => {
    const index = pendingFocusIndex.current;
    if (index === null) return;

    pendingFocusIndex.current = null;
    const target =
      removeButtonRefs.current[index] ??
      removeButtonRefs.current[index - 1] ??
      addButtonRef.current;
    target?.focus();
  }, [value]);

  const addAttachments = (attachments: Attachment[]) => {
    const existingIds = new Set(value.map((attachment) => attachment.id));
    const merged = [
      ...value,
      ...attachments.filter((attachment) => !existingIds.has(attachment.id)),
    ];
    onChange(merged);
  };

  const removeAttachment = (id: string) => {
    pendingFocusIndex.current = value.findIndex((attachment) => attachment.id === id);
    onChange(value.filter((attachment) => attachment.id !== id));
  };

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      {value.length > 0 ? (
        <ul className={styles.list} aria-labelledby={ariaLabelledby}>
          {value.map((attachment, index) => (
            <li key={attachment.id} className={styles.tile}>
              <FileTypeIcon type={attachment.documentType} className={styles.tileIcon} />
              <span className={styles.tileName}>{attachment.name}</span>
              <span className={styles.tileSize}>{formatFileSize(attachment.size)}</span>
              {attachment.kind === "upload" ? (
                <span className={styles.newBadge}>{t("newBadge")}</span>
              ) : null}
              <button
                ref={(node) => {
                  removeButtonRefs.current[index] = node;
                }}
                type="button"
                className={styles.removeButton}
                onClick={() => removeAttachment(attachment.id)}
                aria-label={t("remove", { name: attachment.name })}
                disabled={disabled}
                {...preventFirefoxDisabledRestore}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        ref={addButtonRef}
        id={addButtonId}
        type="button"
        className={styles.addButton}
        aria-labelledby={ariaLabelledby ? `${ariaLabelledby} ${addButtonId}` : undefined}
        onClick={() => setIsPickerOpen(true)}
        disabled={disabled}
        {...preventFirefoxDisabledRestore}
      >
        <svg
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
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {t("addAttachments")}
      </button>

      <AttachmentPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onConfirm={addAttachments}
        existingIds={value.map((attachment) => attachment.id)}
      />
    </div>
  );
}
