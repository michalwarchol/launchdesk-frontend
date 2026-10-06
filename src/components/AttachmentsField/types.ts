import { DocumentType } from "@/lib/api/types";

interface AttachmentBase {
  id: string;
  name: string;
  size: number;
  extension: string;
  documentType: DocumentType;
}

export type Attachment =
  | ({ kind: "document" } & AttachmentBase)
  | ({ kind: "upload"; file: File } & AttachmentBase);
