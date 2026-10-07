import OAuthButtons from "./OAuthButtons";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof OAuthButtons> = {
  title: "Components/OAuthButtons",
  component: OAuthButtons,
  args: { apiBase: "http://localhost:4000/api" },
};

export default meta;

type Story = StoryObj<typeof OAuthButtons>;

export const Default: Story = {};

export const WithNextPath: Story = {
  args: { apiBase: "http://localhost:4000/api", next: "/tasks" },
};

export const Disabled: Story = {
  args: { apiBase: "http://localhost:4000/api", disabled: true },
};
