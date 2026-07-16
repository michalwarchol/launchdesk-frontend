import Avatar from "./Avatar";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  args: {
    title: "Jane Doe",
    subtitle: "jane.doe@example.com",
    src: "https://i.pravatar.cc/150?img=12",
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Small: Story = {
  args: { size: "sm" },
};

export const Medium: Story = {
  args: { size: "md" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Clickable: Story = {
  args: { size: "md", onClick: () => alert("Avatar clicked") },
};

export const NoImageFallback: Story = {
  args: { size: "md", src: undefined },
};
