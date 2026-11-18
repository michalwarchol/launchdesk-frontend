"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import Alert from "@/components/Alert";
import { formatFileSize } from "@/utils/formatFileSize";
import { preventFirefoxDisabledRestore } from "@/utils/preventFirefoxDisabledRestore";

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
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const removeButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pendingFocusIndex = useRef<number | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [rejectedNames, setRejectedNames] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const listLabelId = `${hintId}-files`;

  const acceptedFormats = accept
    ?.split(",")
    .map((token) => token.trim())
    .filter(Boolean)
    .join(", ");

  const instructions = [
    acceptedFormats ? t("acceptedFormats", { formats: acceptedFormats }) : null,
    multiple ? null : t("singleFile"),
  ].filter((instruction): instruction is string => Boolean(instruction));

  useEffect(() => {
    const index = pendingFocusIndex.current;
    if (index === null) return;

    pendingFocusIndex.current = null;
    const target =
      removeButtonRefs.current[index] ?? removeButtonRefs.current[index - 1] ?? zoneRef.current;
    target?.focus();
  }, [files]);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;

    const incomingFiles = Array.from(incoming);
    const accepted = incomingFiles.filter((file) => matchesAccept(file, accept));
    setRejectedNames(
      incomingFiles.filter((file) => !matchesAccept(file, accept)).map((file) => file.name),
    );
    if (accepted.length === 0) return;

    const added = multiple ? accepted : accepted.slice(0, 1);
    setAnnouncement(t("added", { count: added.length }));
    onFilesChange(multiple ? [...files, ...added] : added);
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
    pendingFocusIndex.current = index;
    setAnnouncement(t("removed", { name: files[index].name }));
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
        ref={zoneRef}
        className={zoneClassName}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-describedby={instructions.length > 0 ? hintId : undefined}
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <p className={styles.hint}>{isDragActive ? t("hintDragActive") : t("hint")}</p>
        <span className={styles.browse}>{t("browse")}</span>
        {instructions.length > 0 ? (
          <p id={hintId} className={styles.instructions}>
            {instructions.join(" ")}
          </p>
        ) : null}
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

      {rejectedNames.length > 0 ? (
        <Alert>
          {t("rejected", {
            names: rejectedNames.join(", "),
            formats: acceptedFormats ?? "",
          })}
        </Alert>
      ) : null}

      {files.length > 0 ? (
        <div className={styles.fileList}>
          <span id={listLabelId} className={styles.fileListLabel}>
            {t("selectedFiles")}
          </span>
          <ul className={styles.files} aria-labelledby={listLabelId}>
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className={styles.file}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                <button
                  ref={(node) => {
                    removeButtonRefs.current[index] = node;
                  }}
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeFile(index)}
                  aria-label={t("remove", { name: file.name })}
                  disabled={disabled}
                  {...preventFirefoxDisabledRestore}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className={styles.visuallyHidden} role="status">
        {announcement}
      </p>
    </div>
  );
}
