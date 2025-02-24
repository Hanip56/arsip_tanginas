"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";
import CellAction from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";

export type ColumnType = {
  id: string;
  nama: string;
  kategori: string;
  poktan: string;
  alamat: string;
  desa: string;
  tahunAnggaran: string;
  volume: string;
  satuan: string;
  longitude: string;
  latitude: string;
  sumberAnggaran: string;
  jenisLahan: string;
  status: string;
  kecamatan: string;
  bpp: string;
  nilaiAnggaran: string;
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
          className="mr-2"
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
    {
      header: () => <div className="w-20">Action</div>,
      id: "action",
      cell: ({ row }) => (
        <div className="w-20 pl-1">
          <CellAction
            data={row.original}
            handleOpenUpdate={(id) => setUpsertOpenId(id)}
          />
        </div>
      ),
    },
    {
      accessorKey: "nama",
      header: () => <div className="w-60">Nama Prasarana</div>,
      cell: ({ row }) => <div className="w-60">{row.original.nama}</div>,
    },
    {
      accessorKey: "kategori",
      header: () => <div className="w-32">Jenis Prasarana</div>,
      cell: ({ row }) => <div className="w-32">{row.original.kategori}</div>,
    },
    {
      accessorKey: "poktan",
      header: () => <div className="w-52">Poktan</div>,
      cell: ({ row }) => <div className="w-52">{row.original.poktan}</div>,
    },
    {
      accessorKey: "alamat",
      header: () => <div className="w-60">Alamat</div>,
      cell: ({ row }) => <div className="w-60">{row.original.alamat}</div>,
    },
    {
      accessorKey: "desa",
      header: () => <div className="w-40">Desa</div>,
      cell: ({ row }) => <div className="w-40">{row.original.desa}</div>,
    },
    {
      accessorKey: "kecamatan",
      header: () => <div className="w-40">Kecamatan</div>,
      cell: ({ row }) => <div className="w-40">{row.original.kecamatan}</div>,
    },
    {
      accessorKey: "nilaiAnggaran",
      header: () => <div className="w-40">Nilai Anggaran</div>,
      cell: ({ row }) => (
        <div className="w-40">{row.original.nilaiAnggaran}</div>
      ),
    },
    {
      accessorKey: "sumberAnggaran",
      header: () => <div className="w-52">Sumber Anggaran</div>,
      cell: ({ row }) => (
        <div className="w-52">{row.original.sumberAnggaran}</div>
      ),
    },
    {
      accessorKey: "volume",
      header: () => <div className="w-20">Volume</div>,
      cell: ({ row }) => <div className="w-20">{row.original.volume}</div>,
    },
    {
      accessorKey: "satuan",
      header: () => <div className="w-20">Satuan</div>,
      cell: ({ row }) => <div className="w-20">{row.original.satuan}</div>,
    },
    {
      accessorKey: "status",
      header: () => <div className="w-40">Status</div>,
      cell: ({ row }) => <div className="w-40">{row.original.status}</div>,
    },
    {
      accessorKey: "jenisLahan",
      header: () => <div className="w-40">Jenis Lahan</div>,
      cell: ({ row }) => <div className="w-40">{row.original.jenisLahan}</div>,
    },
    {
      accessorKey: "longitude",
      header: () => <div className="w-40">Longitude</div>,
      cell: ({ row }) => <div className="w-40">{row.original.longitude}</div>,
    },
    {
      accessorKey: "latitude",
      header: () => <div className="w-40">Latitude</div>,
      cell: ({ row }) => <div className="w-40">{row.original.latitude}</div>,
    },

    {
      accessorKey: "tahunAnggaran",
      header: () => <div className="w-16">Tahun</div>,
      cell: ({ row }) => (
        <div className="w-16">{row.original.tahunAnggaran}</div>
      ),
    },
    {
      accessorKey: "bpp",
      header: () => <div className="w-40">BPP</div>,
      cell: ({ row }) => <div className="w-40">{row.original.bpp}</div>,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="w-60">{row.original.id}</div>,
    },
  ];
};
