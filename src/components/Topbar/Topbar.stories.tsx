import Topbar from "./Topbar";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Topbar> = {
  title: "Components/Topbar",
  component: Topbar,
  args: {
    title: "Users",
    primaryButtonLabel: "Add user",
    onPrimaryClick: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof Topbar>;

export const Default: Story = {};
