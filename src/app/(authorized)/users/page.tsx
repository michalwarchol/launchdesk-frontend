"use client";

import { useTranslations } from "next-intl";

import Avatar from "@/components/Avatar";
import Table, { Column } from "@/components/Table";
import Topbar from "@/components/Topbar";

// TODO: Replace with actual data from the API
import mockData from "./mockData";
import { User } from "./types";

export default function Users() {
  const t = useTranslations("UsersPage");

  const columns: Column<User>[] = [
    {
      key: "name",
      header: t("columnName"),
      render: (row) => (
        <Avatar
          src={row.avatar}
          title={`${row.firstName} ${row.lastName}`}
          size="sm"
          subtitle={row.role}
        />
      ),
    },
    { key: "email", header: t("columnEmail") },
    {
      key: "createdAt",
      header: t("columnCreatedAt"),
      render: (row) => <div>{new Date(row.createdAt).toLocaleDateString()}</div>,
    },
  ];

  return (
    <div>
      <Topbar
        title={t("title")}
        onPrimaryClick={() => console.log("clicked")}
        primaryButtonLabel={t("addUser")}
      />
      <Table data={mockData} columns={columns} getRowId={(row) => row.id} />
    </div>
  );
}
