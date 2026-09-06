import AvatarGroup from "./AvatarGroup";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof AvatarGroup> = {
  title: "Components/AvatarGroup",
  component: AvatarGroup,
};

export default meta;

type Story = StoryObj<typeof AvatarGroup>;

const makeItems = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    name: `User ${index + 1}`,
    src: index % 4 === 3 ? undefined : `https://i.pravatar.cc/150?img=${index + 1}`,
  }));

export const SingleAvatar: Story = {
  args: { items: makeItems(1) },
};

export const ExactlyMax: Story = {
  args: { items: makeItems(3) },
};

export const WithOverflow: Story = {
  args: { items: makeItems(7) },
};

export const WithFallbackInitials: Story = {
  args: { items: makeItems(4) },
};
