"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Dropzone from "@/components/Dropzone";
import Modal from "@/components/Modal";
import Table, { Column, useTableQueryParams } from "@/components/Table";
import Topbar from "@/components/Topbar";
import topbarStyles from "@/components/Topbar/Topbar.module.scss";
import { BFF_BASE } from "@/lib/api/config";
import { isApiError } from "@/lib/api/errors";
import { formatFileSize } from "@/utils/formatFileSize";

import { useDeleteDocumentsMutation, useDocumentsQuery, useUploadDocumentsMutation } from "./api";
import { ACCEPTED_EXTENSIONS } from "./constants";
import { downloadDocument } from "./downloadDocument";
import styles from "./page.module.scss";
import { Document } from "./types";

interface DocumentsViewProps {
  canManage: boolean;
}

export default function DocumentsView({ canManage }: DocumentsViewProps) {
  const t = useTranslations("DocumentsPage");
  const router = useRouter();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { params, getTableProps } = useTableQueryParams();
  const { data, isPending, error } = useDocumentsQuery(params);
  const upload = useUploadDocumentsMutation();
  const deleteDocuments = useDeleteDocumentsMutation();
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const documents = data?.data ?? [];
  const selectedIdStrings = selectedIds.map((id) => String(id));

  const getDeleteModalBody = () => {
    if (selectedIdStrings.length === 1) {
      const document = documents.find((row) => row.id === selectedIdStrings[0]);
      const name = document?.name ?? selectedIdStrings[0];

      return t("deleteModalBody", { name });
    }

    return t("deleteModalBodyMany", { count: selectedIdStrings.length });
  };

  const handleDownloadClick = async (event: React.MouseEvent<HTMLAnchorElement>, row: Document) => {
    event.stopPropagation();

    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    setDownloadError(null);

    const result = await downloadDocument(row.id);

    if (result === "ok") return;

    setDownloadError(
      t(result === "fileMissing" ? "fileMissing" : "downloadError", { name: row.name }),
    );
  };

  const closeUploadModal = () => {
    setIsUploadOpen(false);
    setFiles([]);
    upload.reset();
  };

  const handleUploadSubmit = async () => {
    try {
      await upload.mutateAsync(files);
    } catch {
      return;
    }

    closeUploadModal();
  };

  const openDeleteModal = () => {
    setDeleteError(null);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleteDocuments.isPending) return;

    setIsDeleteOpen(false);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    setDeleteError(null);

    try {
      await deleteDocuments.mutateAsync(selectedIdStrings);
    } catch {
      setDeleteError(t("deleteError"));
      return;
    }

    setSelectedIds([]);
    setIsDeleteOpen(false);
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
        actions={
          <div className={topbarStyles.actions}>
            {canManage ? (
              <Button
                type="button"
                variant="outline"
                disabled={selectedIds.length === 0}
                onClick={openDeleteModal}
              >
                {t("delete")}
              </Button>
            ) : null}
            <Button type="button" variant="primary" onClick={() => setIsUploadOpen(true)}>
              {t("upload")}
            </Button>
          </div>
        }
      />
      {downloadError ? <Alert className={styles.downloadAlert}>{downloadError}</Alert> : null}
      <Table
        {...getTableProps(data?.meta.total)}
        data={documents}
        columns={columns}
        getRowId={(row) => row.id}
        onRowClick={(row) => router.push(`/documents/${row.id}`)}
        selection={canManage ? { selectedIds, onSelectedIdsChange: setSelectedIds } : undefined}
        emptyMessage={t("empty")}
        isLoading={isPending}
        error={error ? t("loadError") : undefined}
      />
      <Modal
        isOpen={isUploadOpen}
        onClose={closeUploadModal}
        title={t("uploadModalTitle")}
        submitLabel={t("uploadSubmit")}
        onSubmit={() => void handleUploadSubmit()}
        isSubmitDisabled={files.length === 0 || upload.isPending}
      >
        {upload.isError ? <Alert>{t(uploadErrorKey)}</Alert> : null}
        <Dropzone files={files} onFilesChange={setFiles} accept={ACCEPTED_EXTENSIONS} />
      </Modal>
      {isDeleteOpen ? (
        <Modal
          isOpen
          onClose={closeDeleteModal}
          title={t("deleteModalTitle")}
          submitLabel={deleteDocuments.isPending ? t("deleteSubmitting") : t("deleteConfirm")}
          onSubmit={() => void confirmDelete()}
          isSubmitDisabled={deleteDocuments.isPending}
        >
          {deleteError ? <Alert variant="error">{deleteError}</Alert> : null}
          <p>{getDeleteModalBody()}</p>
        </Modal>
      ) : null}
    </div>
  );
}
