import { useTranslations } from "next-intl";

import Alert from "@/components/Alert";

import DocxReader from "./DocxReader";
import ImageReader from "./ImageReader";
import PdfReader from "./PdfReader";
import SpreadsheetReader from "./SpreadsheetReader";
import TextReader from "./TextReader";

import type { Document } from "../../types";

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif"]);
const SPREADSHEET_EXTENSIONS = new Set(["xls", "xlsx", "csv"]);

interface DocumentPreviewProps {
  document: Document;
  blob: Blob;
}

export default function DocumentPreview({ document, blob }: DocumentPreviewProps) {
  const t = useTranslations("DocumentReaderPage");
  const extension = document.extension.toLowerCase();

  if (extension === "pdf") {
    return <PdfReader blob={blob} title={document.name} />;
  }

  if (extension === "txt") {
    return <TextReader blob={blob} />;
  }

  if (extension === "docx") {
    return <DocxReader blob={blob} />;
  }

  if (IMAGE_EXTENSIONS.has(extension)) {
    return <ImageReader alt={document.name} blob={blob} extension={extension} />;
  }

  if (SPREADSHEET_EXTENSIONS.has(extension)) {
    return <SpreadsheetReader blob={blob} extension={extension} />;
  }

  return <Alert variant="error">{t("unsupported")}</Alert>;
}
