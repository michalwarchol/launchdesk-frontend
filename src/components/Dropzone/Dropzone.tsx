"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { formatFileSize } from "@/utils/formatFileSize";

import styles from "./Dropzone.module.scss";

export interface DropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;

  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) return true;

  const fileName = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) return fileName.endsWith(token);
    if (token.endsWith("/*")) return mimeType.startsWith(token.slice(0, -1));
    return mimeType === token;
  });
}

export default function Dropzone({
  files,
  onFilesChange,
  accept,
  multiple = true,
  disabled,
}: DropzoneProps) {
  const t = useTranslations("Dropzone");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;

    const accepted = Array.from(incoming).filter((file) => matchesAccept(file, accept));
    if (accepted.length === 0) return;

    onFilesChange(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    if (disabled) return;
    addFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const openFilePicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, fileIndex) => fileIndex !== index));
  };

  const zoneClassName = [
    styles.zone,
    isDragActive ? styles.dragActive : "",
    disabled ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.dropzone}>
      <div
        className={zoneClassName}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <p className={styles.hint}>{isDragActive ? t("hintDragActive") : t("hint")}</p>
        <span className={styles.browse}>{t("browse")}</span>
        <input
          ref={inputRef}
          type="file"
          className={styles.input}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {files.length > 0 ? (
        <div className={styles.fileList}>
          <span className={styles.fileListLabel}>{t("selectedFiles")}</span>
          <ul className={styles.files}>
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className={styles.file}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeFile(index)}
                  aria-label={t("remove")}
                  disabled={disabled}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
