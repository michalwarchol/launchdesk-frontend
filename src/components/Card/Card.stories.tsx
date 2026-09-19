import Card from "./Card";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Plain: Story = {
  args: {
    children: "A bare surface with no header.",
  },
};

export const WithTitle: Story = {
  args: {
    title: "Assignment status",
    children: "Chart goes here.",
  },
};

export const WithTitleAndDescription: Story = {
  args: {
    title: "Team workload",
    description: "Active assignments per team member.",
    children: "Chart goes here.",
  },
};
