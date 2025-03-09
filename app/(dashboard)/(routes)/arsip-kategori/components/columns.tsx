"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";
import CellAction from "./cell-action";

export type ColumnType = {
  id: string;
  nama: string;
  deskripsi?: string | null;
  access?: string;
};

type ColumnParams = {
  setUpsertOpenId: (value: SetStateAction<string>) => void;
  page: number;
  limit: number;
};

export const columns = ({
  setUpsertOpenId,
  limit,
  page,
}: ColumnParams): ColumnDef<ColumnType>[] => {
  return [
    // {
    //   accessorKey: "id",
    //   header: "ID",
    // },
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <div>{row.index + 1 + (page - 1) * limit}</div>,
    },
    {
      accessorKey: "nama",
      header: "Nama",
    },
    {
      accessorKey: "access",
      header: "Akses",
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
