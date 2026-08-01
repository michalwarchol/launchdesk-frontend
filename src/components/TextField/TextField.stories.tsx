import TextField from "./TextField";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  args: {
    label: "Task name",
    placeholder: "Enter a value",
  },
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    label: "Task name",
    size: "lg",
    hideLabel: true,
    placeholder: "Untitled task",
  },
};

export const Small: Story = {
  args: {
    label: "Step name",
    size: "sm",
    placeholder: "e.g. Prepare documents",
  },
};

export const Multiline: Story = {
  args: {
    label: "Description",
    multiline: true,
    rows: 4,
    placeholder: "Describe the task",
  },
};

export const WithError: Story = {
  args: {
    label: "Task name",
    error: "Task name is required",
  },
};

export const Disabled: Story = {
  args: {
    label: "Task name",
    disabled: true,
    defaultValue: "Read only",
  },
};
