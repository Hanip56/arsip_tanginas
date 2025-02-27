"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";
import CellAction from "./cell-action";
import { UserRole } from "@prisma/client";

export type ColumnType = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export const columns = (
  setUpsertOpenId: (value: SetStateAction<string>) => void
): ColumnDef<ColumnType>[] => {
  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "createdAt",
      header: "Dibuat",
    },
    {
      id: "action",
      cell: ({ row }) => (
        <CellAction
          data={row.original}
          handleOpenUpdate={(id) => setUpsertOpenId(id)}
        />
      ),
    },
  ];
};
