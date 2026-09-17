import { useState } from "react";

import DatePicker from "./DatePicker";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

function DefaultDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <DatePicker label="Due date" placeholder="Select a date" value={value} onChange={setValue} />
  );
}

function WithValueDemo() {
  const [value, setValue] = useState<string | null>("2026-03-18");

  return (
    <DatePicker label="Due date" placeholder="Select a date" value={value} onChange={setValue} />
  );
}

function WithErrorDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <DatePicker
      label="Due date"
      placeholder="Select a date"
      value={value}
      onChange={setValue}
      error="Due date is required"
    />
  );
}

function DisabledDemo() {
  const [value, setValue] = useState<string | null>("2026-03-18");

  return (
    <DatePicker
      label="Due date"
      placeholder="Select a date"
      value={value}
      onChange={setValue}
      disabled
    />
  );
}

function WithMinMaxDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <DatePicker
      label="Due date"
      placeholder="Select a date"
      value={value}
      onChange={setValue}
      min="2026-03-10"
      max="2026-04-05"
    />
  );
}

export const Default: Story = {
  render: () => <DefaultDemo />,
};

export const WithValue: Story = {
  render: () => <WithValueDemo />,
};

export const WithError: Story = {
  render: () => <WithErrorDemo />,
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
};

export const WithMinMax: Story = {
  render: () => <WithMinMaxDemo />,
};
