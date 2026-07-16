import Sidebar from "./Sidebar";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};
