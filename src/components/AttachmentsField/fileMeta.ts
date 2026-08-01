import { DocumentType } from "@/app/(authorized)/documents/types";

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "svg"];
const SPREADSHEET_EXTENSIONS = ["xls", "xlsx", "csv"];

export function getExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

export function getDocumentType(extension: string): DocumentType {
  if (IMAGE_EXTENSIONS.includes(extension)) return "image";
  if (SPREADSHEET_EXTENSIONS.includes(extension)) return "spreadsheet";
  return "text";
}
