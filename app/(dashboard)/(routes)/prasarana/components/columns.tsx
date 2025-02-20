"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";
import CellAction from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";

export type ColumnType = {
  id: string;
  nama: string;
  kategori: string;
  jenisLahan: string;
  status: string;
  kecamatan: string;
  tahunAnggaran: string;
};

type Props = {
  setUpsertOpenId: (value: SetStateAction<string>) => void;
  selectedIds: string[];
  setSelectedIds: (value: SetStateAction<string[]>) => void;
};

export const columns = ({
  setUpsertOpenId,
  selectedIds,
  setSelectedIds,
}: Props): ColumnDef<ColumnType>[] => {
  return [
    {
      id: "checkbox",
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.includes(row.original.id)}
          onCheckedChange={(e) =>
            setSelectedIds((prev) =>
              e
                ? [...prev, row.original.id]
                : prev.filter((id) => id !== row.original.id)
            )
          }
        ></Checkbox>
      ),
    },
    // {
    //   accessorKey: "id",
    //   header: "ID",
    //   cell: ({ row }) => <div className="w-60">{row.original.id}</div>,
    // },
    {
      accessorKey: "nama",
      header: "Nama",
    },
    {
      accessorKey: "kategori",
      header: "Kategori",
    },
    {
      accessorKey: "jenisLahan",
      header: "Jenis lahan",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "kecamatan",
      header: "Kecamatan",
    },
    {
      accessorKey: "tahunAnggaran",
      header: "Tahun",
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
