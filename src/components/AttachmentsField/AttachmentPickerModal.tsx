"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { ACCEPTED_EXTENSIONS } from "@/app/(authorized)/documents/constants";
import mockData from "@/app/(authorized)/documents/mockData";
import { DocumentType } from "@/app/(authorized)/documents/types";
import Dropzone from "@/components/Dropzone";
import Modal from "@/components/Modal";
import { formatFileSize } from "@/utils/formatFileSize";

import styles from "./AttachmentPickerModal.module.scss";
import { getDocumentType, getExtension } from "./fileMeta";
import FileTypeIcon from "./FileTypeIcon";
import { Attachment } from "./types";

interface AttachmentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (attachments: Attachment[]) => void;
  existingIds: string[];
}

type Tab = "library" | "upload";
type TypeFilter = "all" | DocumentType;

const TYPE_FILTERS: TypeFilter[] = ["all", "text", "spreadsheet", "image"];

export default function AttachmentPickerModal({
  isOpen,
  onClose,
  onConfirm,
  existingIds,
}: AttachmentPickerModalProps) {
  const t = useTranslations("Attachments");
  const documents = mockData;

  const [tab, setTab] = useState<Tab>("library");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesType = typeFilter === "all" || document.type === typeFilter;
      const matchesQuery = query === "" || document.name.toLowerCase().includes(query);
      return matchesType && matchesQuery;
    });
  }, [documents, search, typeFilter]);

  const reset = () => {
    setTab("library");
    setSearch("");
    setTypeFilter("all");
    setSelectedDocIds([]);
    setUploadFiles([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const toggleDoc = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((current) => current !== id) : [...prev, id],
    );
  };

  const handleConfirm = () => {
    const libraryAttachments: Attachment[] = documents
      .filter((document) => selectedDocIds.includes(document.id))
      .map((document) => ({
        kind: "document",
        id: document.id,
        name: document.name,
        size: document.size,
        extension: document.extension,
        documentType: document.type,
      }));

    // TODO: upload to storage / add to /documents once the API is available
    const uploadAttachments: Attachment[] = uploadFiles.map((file) => {
      const extension = getExtension(file.name);

      return {
        kind: "upload",
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        extension,
        documentType: getDocumentType(extension),
        file,
      };
    });

    onConfirm([...libraryAttachments, ...uploadAttachments]);
    reset();
    onClose();
  };

  const isConfirmDisabled = selectedDocIds.length === 0 && uploadFiles.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("pickerTitle")}
      submitLabel={t("add")}
      onSubmit={handleConfirm}
      isSubmitDisabled={isConfirmDisabled}
      className={styles.modal}
    >
      <div className={styles.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "library"}
          className={[styles.tab, tab === "library" ? styles.tabActive : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setTab("library")}
        >
          {t("tabLibrary")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "upload"}
          className={[styles.tab, tab === "upload" ? styles.tabActive : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setTab("upload")}
        >
          {t("tabUpload")}
        </button>
      </div>

      {tab === "library" ? (
        <div className={styles.library}>
          <input
            type="search"
            className={styles.search}
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label={t("searchPlaceholder")}
          />

          <div className={styles.filters}>
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={[styles.filter, typeFilter === filter ? styles.filterActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setTypeFilter(filter)}
              >
                {t(`filter.${filter}`)}
              </button>
            ))}
          </div>

          {filteredDocuments.length === 0 ? (
            <p className={styles.empty}>{t("libraryEmpty")}</p>
          ) : (
            <ul className={styles.docList}>
              {filteredDocuments.map((document) => {
                const alreadyAdded = existingIds.includes(document.id);
                const checked = alreadyAdded || selectedDocIds.includes(document.id);

                return (
                  <li key={document.id}>
                    <label
                      className={[styles.docRow, alreadyAdded ? styles.docRowDisabled : ""]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={alreadyAdded}
                        onChange={() => toggleDoc(document.id)}
                      />
                      <FileTypeIcon type={document.type} className={styles.docIcon} />
                      <span className={styles.docName}>{document.name}</span>
                      <span className={styles.docSize}>{formatFileSize(document.size)}</span>
                      {alreadyAdded ? (
                        <span className={styles.addedBadge}>{t("alreadyAdded")}</span>
                      ) : null}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : (
        <Dropzone files={uploadFiles} onFilesChange={setUploadFiles} accept={ACCEPTED_EXTENSIONS} />
      )}
    </Modal>
  );
}
