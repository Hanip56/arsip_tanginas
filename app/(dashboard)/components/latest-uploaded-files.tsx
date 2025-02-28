import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableSimple } from "@/components/ui/data-table-simple";
import { Skeleton } from "@/components/ui/skeleton";
import { GetLatestFiles } from "@/lib/fetcher/drive";
import { formatBytes } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LatestUploadedFiles = () => {
  const query = useQuery({
    queryKey: ["latest-uploaded-file"],
    queryFn: () => GetLatestFiles({}),
  });

  if (query.isLoading || query.isPending) return <LatestUploadedSkeleton />;
  if (query.isError) return <h1>Error...</h1>;

  console.log({ data: query.data });

  const data = query.data?.files.map((file) => ({
    id: file.id,
    name: file.name,
    size: formatBytes(+file.size),
    createdTime: format(file.createdTime, "d MMMM yyyy"),
    thumbnailLink: file.thumbnailLink,
    arsipKategori: file.arsipKategori,
    prasarana: file.prasarana,
    arsipKategoriId: file.arsipKategoriId,
    prasaranaId: file.prasaranaId,
  }));

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Arsip terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTableSimple columns={latestUploadedColumn} data={data} />
      </CardContent>
    </Card>
  );
};

export default LatestUploadedFiles;

const LatestUploadedSkeleton = () => (
  <Card className="w-full space-y-4">
    <div className="p-6 space-y-6">
      <Skeleton className="w-60 h-8" />
      <Skeleton className="w-full h-96" />
    </div>
  </Card>
);

export const latestUploadedColumn: ColumnDef<{
  id: string;
  name: string;
  size: string;
  createdTime: string;
  thumbnailLink: string;
  arsipKategori: string;
  prasarana: string;
  arsipKategoriId: string;
  prasaranaId: string;
}>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },
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
