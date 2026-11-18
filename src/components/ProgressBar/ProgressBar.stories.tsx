import ProgressBar from "./ProgressBar";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof ProgressBar> = {
  title: "Components/ProgressBar",
  component: ProgressBar,
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Empty: Story = {
  args: { value: 0, label: "Task progress" },
};

export const Partial: Story = {
  args: { value: 0.45, label: "Task progress" },
};

export const AlmostDone: Story = {
  args: { value: 0.9, label: "Task progress" },
};

export const Complete: Story = {
  args: { value: 1, label: "Task progress" },
};
