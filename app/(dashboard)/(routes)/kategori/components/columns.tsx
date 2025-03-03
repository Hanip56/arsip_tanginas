"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";
import CellAction from "./cell-action";
import Image from "next/image";

export type ColumnType = {
  id: string;
  nama: string;
  deskripsi?: string | null;
  imageUrl?: string | null;
};

export const columns = (
  setUpsertOpenId: (value: SetStateAction<string>) => void
): ColumnDef<ColumnType>[] => {
  return [
    // {
    //   accessorKey: "id",
    //   header: "ID",
    // },
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "imageUrl",
      header: "Gambar",
      cell: ({ row }) =>
        row.original.imageUrl ? (
          <Image
            src={row.original.imageUrl}
            alt=""
            width={500}
            height={500}
            className="size-32 object-cover"
          />
        ) : (
          <></>
        ),
    },
    {
      accessorKey: "nama",
      header: "Nama",
    },
    {
      accessorKey: "deskripsi",
      header: "Deskripsi",
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
