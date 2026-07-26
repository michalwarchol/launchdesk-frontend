"use client";

import Avatar from "@/components/Avatar";
import Table, { Column } from "@/components/Table";
import Topbar from "@/components/Topbar";

// TODO: Replace with actual data from the API
import mockData from "./mockData";
import { User } from "./types";

const columns: Column<User>[] = [
  {
    key: "name",
    header: "Name",
    render: (row) => (
      <Avatar
        src={row.avatar}
        title={`${row.firstName} ${row.lastName}`}
        size="sm"
        subtitle={row.role}
      />
    ),
  },
  { key: "email", header: "Email" },
  {
    key: "createdAt",
    header: "Created At",
    render: (row) => <div>{new Date(row.createdAt).toLocaleDateString()}</div>,
  },
];

export default function Users() {
  return (
    <div>
      <Topbar
        title="Users"
        onPrimaryClick={() => console.log("clicked")}
        primaryButtonLabel="Add User"
      />
      <Table data={mockData} columns={columns} getRowId={(row) => row.id} />
    </div>
  );
}
