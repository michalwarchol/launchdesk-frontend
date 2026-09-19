import StatCard from "./StatCard";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof StatCard> = {
  title: "Components/StatCard",
  component: StatCard,
};

export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    label: "Active assignments",
    value: "18",
    hint: "2 overdue",
  },
};

export const Danger: Story = {
  args: {
    label: "Overdue",
    value: "2",
    hint: "needs attention",
    tone: "danger",
  },
};

export const Success: Story = {
  args: {
    label: "Completion rate",
    value: "42%",
    hint: "10 of 24 completed",
    tone: "success",
  },
};

export const NoHint: Story = {
  args: {
    label: "Team members",
    value: "12",
  },
};
