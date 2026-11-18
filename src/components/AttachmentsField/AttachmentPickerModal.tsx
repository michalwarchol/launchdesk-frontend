"use client";

import { useTranslations } from "next-intl";
import { useId, useMemo, useRef, useState } from "react";

import { useDocumentsQuery } from "@/app/(authorized)/documents/api";
import { ACCEPTED_EXTENSIONS } from "@/app/(authorized)/documents/constants";
import Checkbox from "@/components/Checkbox";
import Dropzone from "@/components/Dropzone";
import Modal from "@/components/Modal";
import { DocumentType } from "@/lib/api/types";
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
  const baseId = useId();
  const libraryTabId = `${baseId}-library-tab`;
  const uploadTabId = `${baseId}-upload-tab`;
  const panelId = `${baseId}-panel`;
  const tabRefs = useRef<Partial<Record<Tab, HTMLButtonElement>>>({});
  const tabs: Tab[] = ["library", "upload"];
  const {
    data: documentsResponse,
    isPending,
    error,
  } = useDocumentsQuery({ pageSize: 100 }, { enabled: isOpen });
  const documents = useMemo(() => documentsResponse?.data ?? [], [documentsResponse?.data]);

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

    // Picked files are only uploaded once the form that owns them is submitted.
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

  const focusTab = (next: Tab) => {
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  const handleTabListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.indexOf(tab);
    const nextIndex: Record<string, number> = {
      ArrowRight: (currentIndex + 1) % tabs.length,
      ArrowLeft: (currentIndex - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const index = nextIndex[event.key];
    if (index === undefined) return;

    event.preventDefault();
    focusTab(tabs[index]);
  };

  const activeTabId = tab === "library" ? libraryTabId : uploadTabId;

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
      <div
        className={styles.tabs}
        role="tablist"
        aria-label={t("tabsLabel")}
        onKeyDown={handleTabListKeyDown}
      >
        {tabs.map((item) => (
          <button
            key={item}
            ref={(node) => {
              tabRefs.current[item] = node ?? undefined;
            }}
            id={item === "library" ? libraryTabId : uploadTabId}
            type="button"
            role="tab"
            aria-selected={tab === item}
            aria-controls={panelId}
            tabIndex={tab === item ? 0 : -1}
            className={[styles.tab, tab === item ? styles.tabActive : ""].filter(Boolean).join(" ")}
            onClick={() => setTab(item)}
          >
            {t(item === "library" ? "tabLibrary" : "tabUpload")}
          </button>
        ))}
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={activeTabId}>
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

            {isPending && isOpen ? (
              <p className={styles.empty}>{t("libraryLoading")}</p>
            ) : error ? (
              <p className={styles.empty}>{t("libraryError")}</p>
            ) : filteredDocuments.length === 0 ? (
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
                        <Checkbox
                          className={styles.docCheckbox}
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
          <Dropzone
            files={uploadFiles}
            onFilesChange={setUploadFiles}
            accept={ACCEPTED_EXTENSIONS}
          />
        )}
      </div>
    </Modal>
  );
}
