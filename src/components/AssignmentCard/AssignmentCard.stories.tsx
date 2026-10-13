import AssignmentCard from "./AssignmentCard";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof AssignmentCard> = {
  title: "Components/AssignmentCard",
  component: AssignmentCard,
};

export default meta;

type Story = StoryObj<typeof AssignmentCard>;

export const Default: Story = {
  args: {
    href: "/my-tasks/1",
    name: "Onboarding",
    description: "Introduction workflow for newly hired employees.",
    dueDateLabel: "Due date",
    dueDate: "May 2, 2026",
  },
};

export const LongDescription: Story = {
  args: {
    href: "/my-tasks/2",
    name: "Security awareness",
    description:
      "Security best practices and phishing drills for the whole company. Complete the reading, pass the short quiz, and confirm that your accounts use a password manager and multi-factor authentication before the deadline.",
    dueDateLabel: "Due date",
    dueDate: "Jun 21, 2026",
  },
};
