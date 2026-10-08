"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import Alert from "@/components/Alert";
import Dropzone from "@/components/Dropzone";
import Modal from "@/components/Modal";
import Table, { Column, useTableQueryParams } from "@/components/Table";
import Topbar from "@/components/Topbar";
import { BFF_BASE } from "@/lib/api/config";
import { isApiError, parseApiError } from "@/lib/api/errors";
import { formatFileSize } from "@/utils/formatFileSize";

import { useDocumentsQuery, useUploadDocumentsMutation } from "./api";
import { ACCEPTED_EXTENSIONS } from "./constants";
import styles from "./page.module.scss";
import { Document } from "./types";

export default function Documents() {
  const t = useTranslations("DocumentsPage");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { params, getTableProps } = useTableQueryParams();
  const { data, isPending, error } = useDocumentsQuery(params);
  const upload = useUploadDocumentsMutation();
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownloadClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    row: Document,
  ) => {
    event.stopPropagation();

    // Let the browser handle modified clicks (new tab, new window, etc.) natively.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    setDownloadError(null);

    const href = `${BFF_BASE}/documents/${row.id}/download`;

    try {
      const response = await fetch(href, { redirect: "manual" });

      // The backend only redirects (to the storage URL) when the file exists.
      if (response.type === "opaqueredirect") {
        window.location.assign(href);
        return;
      }

      const body = await response.json().catch(() => null);
      const apiError = parseApiError(response.status, body);

      setDownloadError(
        t(apiError.code === "fileMissing" ? "fileMissing" : "downloadError", { name: row.name }),
      );
    } catch {
      setDownloadError(t("downloadError", { name: row.name }));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFiles([]);
    upload.reset();
  };

  const handleSubmit = async () => {
    try {
      await upload.mutateAsync(files);
    } catch {
      return;
    }

    closeModal();
  };

  const uploadErrorKey =
    upload.error && isApiError(upload.error) && upload.error.code === "invalidFileType"
      ? "invalidFileType"
      : "uploadError";

  const columns: Column<Document>[] = [
    { key: "name", header: t("columnName"), sortable: true },
    {
      key: "type",
      header: t("columnType"),
      sortable: true,
      render: (row) => t(`documentType.${row.type}`),
    },
    { key: "extension", header: t("columnExtension") },
    {
      key: "size",
      header: t("columnSize"),
      sortable: true,
      align: "right",
      render: (row) => formatFileSize(row.size),
    },
    {
      key: "download",
      header: "",
      align: "center",
      width: "64px",
      render: (row) => (
        <a
          className={styles.downloadLink}
          href={`${BFF_BASE}/documents/${row.id}/download`}
          aria-label={t("download", { name: row.name })}
          title={t("download", { name: row.name })}
          onClick={(event) => void handleDownloadClick(event, row)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>
      ),
    },
  ];

  return (
    <div>
      <Topbar
        title={t("title")}
        onPrimaryClick={() => setIsModalOpen(true)}
        primaryButtonLabel={t("upload")}
      />
      {downloadError ? <Alert className={styles.downloadAlert}>{downloadError}</Alert> : null}
      <Table
        {...getTableProps(data?.meta.total)}
        data={data?.data ?? []}
        columns={columns}
        getRowId={(row) => row.id}
        emptyMessage={t("empty")}
        isLoading={isPending}
        error={error ? t("loadError") : undefined}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={t("uploadModalTitle")}
        submitLabel={t("uploadSubmit")}
        onSubmit={handleSubmit}
        isSubmitDisabled={files.length === 0 || upload.isPending}
      >
        {upload.isError ? <Alert>{t(uploadErrorKey)}</Alert> : null}
        <Dropzone files={files} onFilesChange={setFiles} accept={ACCEPTED_EXTENSIONS} />
      </Modal>
    </div>
  );
}
