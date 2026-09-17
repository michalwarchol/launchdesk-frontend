import Sidebar from "./Sidebar";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    user: {
      name: "Jane Smith",
      email: "jane.smith@michalwarchol.com",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};

export const WithoutPhoto: Story = {
  args: {
    user: {
      name: "Alex Nowak",
      email: "alex.nowak@michalwarchol.com",
    },
  },
};
