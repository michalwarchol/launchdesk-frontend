"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import Dropzone from "@/components/Dropzone";
import Modal from "@/components/Modal";
import Table, { Column } from "@/components/Table";
import Topbar from "@/components/Topbar";
import { formatFileSize } from "@/utils/formatFileSize";

import { ACCEPTED_EXTENSIONS } from "./constants";
// TODO: Replace with actual data from the API
import mockData from "./mockData";
import { Document } from "./types";

export default function Documents() {
  const t = useTranslations("DocumentsPage");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const closeModal = () => {
    setIsModalOpen(false);
    setFiles([]);
  };

  const handleSubmit = () => {
    // TODO: upload files once the storage/API is available
    console.info("Files to upload:", files);
    closeModal();
  };

  const columns: Column<Document>[] = [
    { key: "name", header: t("columnName") },
    {
      key: "type",
      header: t("columnType"),
      render: (row) => t(`documentType.${row.type}`),
    },
    { key: "extension", header: t("columnExtension") },
    {
      key: "size",
      header: t("columnSize"),
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
        data={mockData}
        columns={columns}
        getRowId={(row) => row.id}
        emptyMessage={t("empty")}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={t("uploadModalTitle")}
        submitLabel={t("uploadSubmit")}
        onSubmit={handleSubmit}
        isSubmitDisabled={files.length === 0}
      >
        <Dropzone files={files} onFilesChange={setFiles} accept={ACCEPTED_EXTENSIONS} />
      </Modal>
    </div>
  );
}
