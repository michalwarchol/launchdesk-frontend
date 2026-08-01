import { useState } from "react";

import RichTextEditor from "./RichTextEditor";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof RichTextEditor> = {
  title: "Components/RichTextEditor",
  component: RichTextEditor,
};

export default meta;

type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = useState("");

    return (
      <RichTextEditor
        value={value}
        onChange={setValue}
        placeholder="Describe this step in detail…"
      />
    );
  },
};

export const WithContent: Story = {
  render: function WithContentStory() {
    const [value, setValue] = useState(
      "<h2>Prepare the environment</h2><p>Follow these steps:</p><ul><li>Install dependencies</li><li>Configure the <strong>API keys</strong></li></ul><blockquote>Remember to double-check the credentials.</blockquote>",
    );

    return <RichTextEditor value={value} onChange={setValue} />;
  },
};

export const WithError: Story = {
  render: function WithErrorStory() {
    const [value, setValue] = useState("");

    return (
      <RichTextEditor
        value={value}
        onChange={setValue}
        placeholder="Describe this step in detail…"
        error="Description is invalid"
      />
    );
  },
};

export const Disabled: Story = {
  render: function DisabledStory() {
    const [value, setValue] = useState("<p>This content cannot be edited.</p>");

    return <RichTextEditor value={value} onChange={setValue} disabled />;
  },
};
