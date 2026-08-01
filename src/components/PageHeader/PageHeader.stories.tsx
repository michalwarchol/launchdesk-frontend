import Button from "@/components/Button";

import PageHeader from "./PageHeader";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  component: PageHeader,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "Create new task",
    onBack: () => {},
  },
};

export const WithSubtitle: Story = {
  args: {
    title: "Create new task",
    subtitle: "Describe the steps required to complete this task.",
    onBack: () => {},
  },
};

export const WithActions: Story = {
  args: {
    title: "Create new task",
    subtitle: "Describe the steps required to complete this task.",
    onBack: () => {},
    children: (
      <>
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => {}}>
          Save
        </Button>
      </>
    ),
  },
};
