"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GetInfo } from "@/lib/fetcher/drive";
import { cn, formatBytes } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { IconType } from "react-icons/lib";
import { MdFileCopy, MdPerson, MdStorage } from "react-icons/md";
import { PiBuildingOffice } from "react-icons/pi";
import { useSession } from "next-auth/react";
import Profile from "./profile";
import PrasaranaGrid from "./prasarana-grid";
import { PrasaranaKategori } from "@prisma/client";

type DriveInfoMapper = {
  label: string;
  icon: IconType;
  value: number | string | undefined;
}[];

type Props = {
  totalUser: number;
  totalPrasarana: number;
  prasaranaKategori: PrasaranaKategori[];
};

const ClientComp = ({
  totalPrasarana,
  totalUser,
  prasaranaKategori,
}: Props) => {
  const { data: session } = useSession();
  const isAdmin = session?.user.role !== "USER";

  const driveInfoQuery = useQuery({
    queryKey: ["drive"],
    queryFn: GetInfo,
  });

  const data = driveInfoQuery.data;

  let driveInfoMapper: DriveInfoMapper = [
    {
      label: "Jumlah Prasarana",
      icon: PiBuildingOffice,
      value: totalPrasarana,
    },
    {
      label: "Jumlah arsip file",
      icon: MdFileCopy,
      value: data?.totalFiles ?? 0,
    },
  ];

  const driveInfoMapperAdminOnly = [
    {
      label: "Jumlah User",
      icon: MdPerson,
      value: totalUser,
    },
    {
      label: "Penyimpanan digunakan",
      icon: MdStorage,
      value: data?.storage?.driveUsed
        ? formatBytes(data?.storage?.driveUsed)
        : 0,
    },
  ];

  if (isAdmin) {
    driveInfoMapper = [...driveInfoMapper, ...driveInfoMapperAdminOnly];
  }

  return (
    <div className="space-y-8">
      {/* Information grid */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10",
          isAdmin && "lg:grid-cols-4"
        )}
      >
        {driveInfoMapper.map((mapper, i) => (
          <Card key={i}>
            {driveInfoQuery.isLoading && (
              <div className="p-4 space-y-2">
                <div className="w-full flex items-center gap-4">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="size-4" />
                </div>
                <Skeleton className="w-[60%] h-8" />
              </div>
            )}

            {!driveInfoQuery.isLoading && (
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm font-medium">{mapper.label}</div>
                  <mapper.icon className="text-main-2" />
                </div>
                <div className="font-semibold text-2xl">{mapper.value}</div>
                {/* <p className="text-xs text-muted-foreground">
                  Lorem ipsum dolor sit.
                </p> */}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Profile */}
      {/* <Profile /> */}

      {/* prasarana-grid */}
      <PrasaranaGrid kategoris={prasaranaKategori} />
    </div>
  );
};

export default ClientComp;
