"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import Alert from "@/components/Alert";
import Dropzone from "@/components/Dropzone";
import Modal from "@/components/Modal";
import Table, { Column, useTableQueryParams } from "@/components/Table";
import Topbar from "@/components/Topbar";
import { isApiError } from "@/lib/api/errors";
import { formatFileSize } from "@/utils/formatFileSize";

import { useDocumentsQuery, useUploadDocumentsMutation } from "./api";
import { ACCEPTED_EXTENSIONS } from "./constants";
import { Document } from "./types";

export default function Documents() {
  const t = useTranslations("DocumentsPage");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { params, getTableProps } = useTableQueryParams();
  const { data, isPending, error } = useDocumentsQuery(params);
  const upload = useUploadDocumentsMutation();

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
  ];

  return (
    <div>
      <Topbar
        title={t("title")}
        onPrimaryClick={() => setIsModalOpen(true)}
        primaryButtonLabel={t("upload")}
      />
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
