"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export type ColumnType = {
  id: string;
  name: string;
  size: string;
  createdTime: string;
  thumbnailLink: string;
  arsipKategori: string;
  prasarana: string;
  arsipKategoriId: string;
  prasaranaId: string;
};

export const columns = (): ColumnDef<ColumnType>[] => {
  return [
    {
      accessorKey: "thumbnailLink",
      header: () => <div className="w-32">Pratinjau</div>,
      cell: ({ row }) => (
        <>
          {row.original.thumbnailLink ? (
            <Image
              src={row.original.thumbnailLink}
              alt={row.original.name}
              width={1000}
              height={1000}
              className="size-32 object-cover flex-shrink-0"
            />
          ) : (
            <div className="size-32 rounded-md bg-muted-foreground" />
          )}
        </>
      ),
    },
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "arsipKategori",
      header: "Jenis Arsip",
    },
    {
      accessorKey: "prasarana",
      header: "Prasarana",
    },
    {
      accessorKey: "createdTime",
      header: "Dibuat",
    },
    {
      id: "link",
      header: "Arsip",
      cell: ({ row }) => (
        <Link
          href={`/prasarana/${row.original.prasaranaId}?arsipKategoriId=${row.original.arsipKategoriId}`}
        >
          <Button variant="ghost" size="icon">
            <ChevronRight className="size-5" />
          </Button>
        </Link>
      ),
    },
  ];
};
