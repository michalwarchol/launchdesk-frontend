import { useState } from "react";

import AttachmentsField from "./AttachmentsField";
import { Attachment } from "./types";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof AttachmentsField> = {
  title: "Components/AttachmentsField",
  component: AttachmentsField,
};

export default meta;

type Story = StoryObj<typeof AttachmentsField>;

const documentAttachment: Attachment = {
  kind: "document",
  id: "1",
  name: "quarterly-report.pdf",
  size: 2_400_000,
  extension: "pdf",
  documentType: "text",
};

const uploadAttachment: Attachment = {
  kind: "upload",
  id: "local-1",
  name: "handover.docx",
  size: 42_000,
  extension: "docx",
  documentType: "text",
  file: new File([new ArrayBuffer(42_000)], "handover.docx"),
};

export const Empty: Story = {
  render: function EmptyStory() {
    const [value, setValue] = useState<Attachment[]>([]);
    return <AttachmentsField value={value} onChange={setValue} />;
  },
};

export const WithLibraryDocuments: Story = {
  render: function WithLibraryStory() {
    const [value, setValue] = useState<Attachment[]>([documentAttachment]);
    return <AttachmentsField value={value} onChange={setValue} />;
  },
};

export const WithUpload: Story = {
  render: function WithUploadStory() {
    const [value, setValue] = useState<Attachment[]>([documentAttachment, uploadAttachment]);
    return <AttachmentsField value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  render: function DisabledStory() {
    const [value, setValue] = useState<Attachment[]>([documentAttachment]);
    return <AttachmentsField value={value} onChange={setValue} disabled />;
  },
};
