import OAuthButtons from "./OAuthButtons";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof OAuthButtons> = {
  title: "Components/OAuthButtons",
  component: OAuthButtons,
};

export default meta;

type Story = StoryObj<typeof OAuthButtons>;

export const Default: Story = {};

export const WithNextPath: Story = {
  args: { next: "/tasks" },
};

export const Disabled: Story = {
  args: { disabled: true },
};
