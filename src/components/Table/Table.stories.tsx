import { useState } from "react";

import Table from "./Table";

import type { Column, FilterConfig, PaginationState, SortDirection, SortState } from "./types";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

const USERS: User[] = [
  { id: 1, name: "Jane Doe", email: "jane.doe@example.com", role: "Admin", status: "active" },
  { id: 2, name: "John Smith", email: "john.smith@example.com", role: "Member", status: "active" },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Member",
    status: "inactive",
  },
  { id: 4, name: "Bob Brown", email: "bob.brown@example.com", role: "Viewer", status: "active" },
  {
    id: 5,
    name: "Carol White",
    email: "carol.white@example.com",
    role: "Member",
    status: "inactive",
  },
];

const columns: Column<User>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email", sortable: true },
  { key: "role", header: "Role" },
  {
    key: "status",
    header: "Status",
    align: "center",
    render: (row) => (row.status === "active" ? "Active" : "Inactive"),
  },
];

const roleFilter: FilterConfig = {
  key: "role",
  label: "Role",
  type: "select",
  options: [
    { label: "Admin", value: "Admin" },
    { label: "Member", value: "Member" },
    { label: "Viewer", value: "Viewer" },
  ],
};

const sortUsers = (data: User[], sort: SortState) => {
  if (!sort) return data;

  const sorted = [...data].sort((a, b) => {
    const aValue = String(a[sort.key as keyof User]);
    const bValue = String(b[sort.key as keyof User]);
    return aValue.localeCompare(bValue);
  });

  return sort.direction === "asc" ? sorted : sorted.reverse();
};

export const Default: Story = {
  render: () => <Table columns={columns} data={USERS} getRowId={(row) => row.id} />,
};

export const Sortable: Story = {
  render: function SortableStory() {
    const [sort, setSort] = useState<SortState>(null);
    const data = sortUsers(USERS, sort);

    const handleSortChange = (key: string, direction: SortDirection) => setSort({ key, direction });

    return (
      <Table
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        sort={sort}
        onSortChange={handleSortChange}
      />
    );
  },
};

export const WithFilters: Story = {
  render: function WithFiltersStory() {
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});

    const handleFilterChange = (key: string, value: string) =>
      setFilterValues((current) => ({ ...current, [key]: value }));

    const data = filterValues.role
      ? USERS.filter((user) => user.role === filterValues.role)
      : USERS;

    return (
      <Table
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        filters={[roleFilter]}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
      />
    );
  },
};

export const Clickable: Story = {
  render: function ClickableStory() {
    const [selected, setSelected] = useState<User | null>(null);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Table columns={columns} data={USERS} getRowId={(row) => row.id} onRowClick={setSelected} />
        {selected ? <p>Selected: {selected.name}</p> : null}
      </div>
    );
  },
};

export const WithPagination: Story = {
  render: function WithPaginationStory() {
    const pageSize = 2;
    const [page, setPage] = useState(1);

    const pagination: PaginationState = { page, pageSize, total: USERS.length };
    const data = USERS.slice((page - 1) * pageSize, page * pageSize);

    return (
      <Table
        columns={columns}
        data={data}
        getRowId={(row) => row.id}
        pagination={pagination}
        onPageChange={setPage}
      />
    );
  },
};

export const Loading: Story = {
  render: () => <Table columns={columns} data={[]} getRowId={(row) => row.id} isLoading />,
};

export const Empty: Story = {
  render: () => (
    <Table columns={columns} data={[]} getRowId={(row) => row.id} emptyMessage="No users found" />
  ),
};
