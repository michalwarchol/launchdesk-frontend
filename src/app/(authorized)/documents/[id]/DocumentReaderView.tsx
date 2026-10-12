"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import Alert from "@/components/Alert";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import { isApiError } from "@/lib/api/errors";

import { useDocumentFileQuery, useDocumentQuery } from "../api";
import { downloadDocument } from "../downloadDocument";

import styles from "./page.module.scss";
import DocumentPreview from "./readers/DocumentPreview";

interface DocumentReaderViewProps {
  documentId: string;
}

export default function DocumentReaderView({ documentId }: DocumentReaderViewProps) {
  const t = useTranslations("DocumentReaderPage");
  const documentQuery = useDocumentQuery(documentId);
  const fileQuery = useDocumentFileQuery(documentId, { enabled: Boolean(documentQuery.data) });
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const document = documentQuery.data;

  const handleDownload = async () => {
    if (!document) return;

    setDownloadError(null);
    const result = await downloadDocument(document.id);

    if (result === "ok") return;

    setDownloadError(
      t(result === "fileMissing" ? "fileMissing" : "downloadError", { name: document.name }),
    );
  };

  const title = document?.name ?? (documentQuery.isPending ? "…" : t("notFound"));

  const preview = () => {
    if (documentQuery.isPending || (document && fileQuery.isPending)) {
      return (
        <p className={styles.status} role="status">
          {t("loading")}
        </p>
      );
    }

    if (documentQuery.error || !document) {
      return <Alert variant="error">{documentQuery.error ? t("loadError") : t("notFound")}</Alert>;
    }

    if (fileQuery.error || !fileQuery.data) {
      const missing = isApiError(fileQuery.error) && fileQuery.error.code === "fileMissing";

      return (
        <Alert variant="error">
          {missing ? t("fileMissing", { name: document.name }) : t("previewError")}
        </Alert>
      );
    }

    return (
      <DocumentPreview
        key={`${document.id}-${fileQuery.dataUpdatedAt}`}
        blob={fileQuery.data}
        document={document}
      />
    );
  };

  return (
    <div className={styles.page}>
      <PageHeader title={title} backHref="/documents">
        {document ? (
          <Button variant="outline" onClick={() => void handleDownload()}>
            {t("download")}
          </Button>
        ) : null}
      </PageHeader>
      <div className={styles.stage}>
        {downloadError ? <Alert variant="error">{downloadError}</Alert> : null}
        {preview()}
      </div>
    </div>
  );
}
