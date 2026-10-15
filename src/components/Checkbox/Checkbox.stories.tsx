import Checkbox from "./Checkbox";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Require notes",
  },
};

export const Checked: Story = {
  args: {
    label: "Require notes",
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Require notes",
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Require notes",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Require notes",
    defaultChecked: true,
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    ariaLabel: "Select row",
  },
};
