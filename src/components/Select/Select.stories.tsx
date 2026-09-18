import { useState } from "react";

import Select, { SelectOption } from "./Select";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

const LANGUAGES: SelectOption[] = [
  { value: "en", label: "English" },
  { value: "pl", label: "Polski" },
];

const ROLES: SelectOption[] = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
];

const TIME_ZONES: SelectOption[] = [
  "Europe/Warsaw",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Lisbon",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Asia/Dubai",
  "Australia/Sydney",
].map((zone) => ({ value: zone, label: zone.replace("_", " ") }));

function DefaultDemo() {
  const [value, setValue] = useState("en");

  return <Select label="Language" options={LANGUAGES} value={value} onChange={setValue} />;
}

function WithPlaceholderDemo() {
  const [value, setValue] = useState("");

  return (
    <Select
      label="Role"
      placeholder="Select a role"
      options={ROLES}
      value={value}
      onChange={setValue}
    />
  );
}

function LongListDemo() {
  const [value, setValue] = useState("Europe/Warsaw");

  return (
    <Select
      label="Time zone"
      placeholder="Select a time zone"
      options={TIME_ZONES}
      value={value}
      onChange={setValue}
    />
  );
}

function SmallDemo() {
  const [value, setValue] = useState("");

  return (
    <Select
      size="sm"
      label="Role"
      placeholder="All"
      options={ROLES}
      value={value}
      onChange={setValue}
    />
  );
}

function LargeDemo() {
  const [value, setValue] = useState("en");

  return (
    <Select size="lg" label="Language" options={LANGUAGES} value={value} onChange={setValue} />
  );
}

function WithErrorDemo() {
  const [value, setValue] = useState("");

  return (
    <Select
      label="Role"
      placeholder="Select a role"
      options={ROLES}
      value={value}
      onChange={setValue}
      error="Role is required"
    />
  );
}

function EmptyDemo() {
  const [value, setValue] = useState("");

  return (
    <Select
      label="Role"
      placeholder="Select a role"
      options={[]}
      value={value}
      onChange={setValue}
    />
  );
}

function DisabledDemo() {
  const [value, setValue] = useState("en");

  return <Select disabled label="Language" options={LANGUAGES} value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: () => <DefaultDemo />,
};

export const WithPlaceholder: Story = {
  render: () => <WithPlaceholderDemo />,
};

export const LongList: Story = {
  render: () => <LongListDemo />,
};

export const Small: Story = {
  render: () => <SmallDemo />,
};

export const Large: Story = {
  render: () => <LargeDemo />,
};

export const WithError: Story = {
  render: () => <WithErrorDemo />,
};

export const NoOptions: Story = {
  render: () => <EmptyDemo />,
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
};
