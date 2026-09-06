import { useMemo, useState } from "react";

import Avatar from "@/components/Avatar";

import Autocomplete from "./Autocomplete";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Autocomplete> = {
  title: "Components/Autocomplete",
  component: Autocomplete,
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

interface TaskOption {
  id: string;
  name: string;
}

const TASKS: TaskOption[] = [
  { id: "1", name: "Onboarding" },
  { id: "2", name: "Compliance training" },
  { id: "3", name: "Equipment setup" },
  { id: "4", name: "Performance review" },
  { id: "5", name: "Offboarding" },
];

interface UserOption {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

const USERS: UserOption[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@michalwarchol.com",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@michalwarchol.com",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "3",
    firstName: "Alex",
    lastName: "Nowak",
    email: "alex.nowak@michalwarchol.com",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "4",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@michalwarchol.com",
    avatar: "https://i.pravatar.cc/150?img=14",
  },
];

function SingleDemo() {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<TaskOption | null>(null);

  const options = useMemo(
    () => TASKS.filter((task) => task.name.toLowerCase().includes(inputValue.trim().toLowerCase())),
    [inputValue],
  );

  return (
    <Autocomplete<TaskOption>
      label="Task"
      placeholder="Search for a task"
      options={options}
      getOptionLabel={(task) => task.name}
      getOptionKey={(task) => task.id}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      value={value}
      onChange={setValue}
    />
  );
}

function MultipleDemo() {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<TaskOption[]>([]);

  const options = useMemo(
    () => TASKS.filter((task) => task.name.toLowerCase().includes(inputValue.trim().toLowerCase())),
    [inputValue],
  );

  return (
    <Autocomplete<TaskOption>
      multiple
      label="Tasks"
      placeholder="Search for tasks"
      options={options}
      getOptionLabel={(task) => task.name}
      getOptionKey={(task) => task.id}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      value={value}
      onChange={setValue}
    />
  );
}

function WithAvatarsDemo() {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<UserOption[]>([USERS[0]]);

  const options = useMemo(
    () =>
      USERS.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(inputValue.trim().toLowerCase()),
      ),
    [inputValue],
  );

  return (
    <Autocomplete<UserOption>
      multiple
      label="Assignees"
      placeholder="Search for people"
      options={options}
      getOptionLabel={(user) => `${user.firstName} ${user.lastName}`}
      getOptionKey={(user) => user.id}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      value={value}
      onChange={setValue}
      renderOption={(user) => (
        <Avatar
          src={user.avatar}
          title={`${user.firstName} ${user.lastName}`}
          subtitle={user.email}
          size="sm"
        />
      )}
      renderValue={(user) => (
        <>
          <Avatar
            src={user.avatar}
            title={`${user.firstName} ${user.lastName}`}
            size="sm"
            hideText
          />
          {user.firstName} {user.lastName}
        </>
      )}
    />
  );
}

function WithErrorDemo() {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<TaskOption | null>(null);

  return (
    <Autocomplete<TaskOption>
      label="Task"
      placeholder="Search for a task"
      options={TASKS}
      getOptionLabel={(task) => task.name}
      getOptionKey={(task) => task.id}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      value={value}
      onChange={setValue}
      error="Task is required"
    />
  );
}

function LoadingDemo() {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<TaskOption | null>(null);

  return (
    <Autocomplete<TaskOption>
      label="Task"
      placeholder="Search for a task"
      options={[]}
      getOptionLabel={(task) => task.name}
      getOptionKey={(task) => task.id}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      value={value}
      onChange={setValue}
      isLoading
    />
  );
}

function DisabledDemo() {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<TaskOption | null>(TASKS[0]);

  return (
    <Autocomplete<TaskOption>
      label="Task"
      placeholder="Search for a task"
      options={TASKS}
      getOptionLabel={(task) => task.name}
      getOptionKey={(task) => task.id}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      value={value}
      onChange={setValue}
      disabled
    />
  );
}

export const Single: Story = {
  render: () => <SingleDemo />,
};

export const Multiple: Story = {
  render: () => <MultipleDemo />,
};

export const WithAvatars: Story = {
  render: () => <WithAvatarsDemo />,
};

export const WithError: Story = {
  render: () => <WithErrorDemo />,
};

export const Loading: Story = {
  render: () => <LoadingDemo />,
};

export const Disabled: Story = {
  render: () => <DisabledDemo />,
};
