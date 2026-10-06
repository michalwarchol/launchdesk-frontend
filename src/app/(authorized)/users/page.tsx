"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import Avatar from "@/components/Avatar";
import Table, { Column, useTableQueryParams } from "@/components/Table";
import Topbar from "@/components/Topbar";

import { useUsersQuery } from "./api";
import InviteUserModal from "./InviteUserModal";
import { User } from "./types";

export default function Users() {
  const t = useTranslations("UsersPage");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { params, getTableProps } = useTableQueryParams();
  const { data, isPending, error } = useUsersQuery(params);

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
    { key: "email", header: t("columnEmail"), sortable: true },
    {
      key: "createdAt",
      header: t("columnCreatedAt"),
      sortable: true,
      render: (row) => <div>{new Date(row.createdAt).toLocaleDateString()}</div>,
    },
  ];

  return (
    <div>
      <Topbar
        title={t("title")}
        onPrimaryClick={() => setIsInviteOpen(true)}
        primaryButtonLabel={t("addUser")}
      />
      <Table
        {...getTableProps(data?.meta.total)}
        data={data?.data ?? []}
        columns={columns}
        getRowId={(row) => row.id}
        emptyMessage={t("empty")}
        isLoading={isPending}
        error={error ? t("loadError") : undefined}
      />
      <InviteUserModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
}
