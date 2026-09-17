import Alert from "./Alert";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Error: Story = {
  args: { children: "Invalid email or password." },
};

export const Info: Story = {
  args: {
    variant: "info",
    children: "Check your inbox for a link to reset your password.",
  },
};
