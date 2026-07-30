export type DocumentType = "image" | "spreadsheet" | "text";

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  extension: string;
  size: number;
  createdAt: string;
}
