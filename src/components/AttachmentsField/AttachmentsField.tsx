"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { formatFileSize } from "@/utils/formatFileSize";

import AttachmentPickerModal from "./AttachmentPickerModal";
import styles from "./AttachmentsField.module.scss";
import FileTypeIcon from "./FileTypeIcon";
import { Attachment } from "./types";

export interface AttachmentsFieldProps {
  value: Attachment[];
  onChange: (next: Attachment[]) => void;
  disabled?: boolean;
  className?: string;
}

export default function AttachmentsField({
  value,
  onChange,
  disabled,
  className,
}: AttachmentsFieldProps) {
  const t = useTranslations("Attachments");
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const addAttachments = (attachments: Attachment[]) => {
    const existingIds = new Set(value.map((attachment) => attachment.id));
    const merged = [
      ...value,
      ...attachments.filter((attachment) => !existingIds.has(attachment.id)),
    ];
    onChange(merged);
  };

  const removeAttachment = (id: string) => {
    onChange(value.filter((attachment) => attachment.id !== id));
  };

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      {value.length > 0 ? (
        <ul className={styles.list}>
          {value.map((attachment) => (
            <li key={attachment.id} className={styles.tile}>
              <FileTypeIcon type={attachment.documentType} className={styles.tileIcon} />
              <span className={styles.tileName}>{attachment.name}</span>
              <span className={styles.tileSize}>{formatFileSize(attachment.size)}</span>
              {attachment.kind === "upload" ? (
                <span className={styles.newBadge}>{t("newBadge")}</span>
              ) : null}
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeAttachment(attachment.id)}
                aria-label={t("remove")}
                disabled={disabled}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        className={styles.addButton}
        onClick={() => setIsPickerOpen(true)}
        disabled={disabled}
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
