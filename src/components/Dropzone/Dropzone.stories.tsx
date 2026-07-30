import { useState } from "react";

import Dropzone from "./Dropzone";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Dropzone> = {
  title: "Components/Dropzone",
  component: Dropzone,
};

export default meta;

type Story = StoryObj<typeof Dropzone>;

const createFile = (name: string, size: number) =>
  new File([new ArrayBuffer(size)], name, { type: "application/octet-stream" });

export const Default: Story = {
  render: function DefaultStory() {
    const [files, setFiles] = useState<File[]>([]);

    return (
      <Dropzone files={files} onFilesChange={setFiles} accept=".pdf,.docx,.txt,.xlsx,.png,.jpg" />
    );
  },
};

export const WithFiles: Story = {
  render: function WithFilesStory() {
    const [files, setFiles] = useState<File[]>([
      createFile("quarterly-report.pdf", 2_400_000),
      createFile("annual-budget.xlsx", 118_000),
    ]);

    return <Dropzone files={files} onFilesChange={setFiles} />;
  },
};

export const SingleFile: Story = {
  render: function SingleFileStory() {
    const [files, setFiles] = useState<File[]>([]);

    return <Dropzone files={files} onFilesChange={setFiles} multiple={false} />;
  },
};

export const Disabled: Story = {
  render: function DisabledStory() {
    const [files, setFiles] = useState<File[]>([createFile("team-photo.png", 5_600_000)]);

    return <Dropzone files={files} onFilesChange={setFiles} disabled />;
  },
};
