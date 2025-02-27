"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GetInfo } from "@/lib/fetcher/drive";
import { formatBytes } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { IconType } from "react-icons/lib";
import { MdFileCopy, MdPerson, MdStorage } from "react-icons/md";
import { PiBuildingOffice } from "react-icons/pi";
import LatestUploadedFiles from "./latest-uploaded-files";

type DriveInfoMapper = {
  label: string;
  icon: IconType;
  value: number | string | undefined;
}[];

type Props = {
  totalUser: number;
  totalPrasarana: number;
};

const ClientComp = ({ totalPrasarana, totalUser }: Props) => {
  const driveInfoQuery = useQuery({
    queryKey: ["drive"],
    queryFn: GetInfo,
  });

  const data = driveInfoQuery.data;

  const driveInfoMapper: DriveInfoMapper = [
    {
      label: "Total Prasarana",
      icon: PiBuildingOffice,
      value: totalPrasarana,
    },
    {
      label: "Total User",
      icon: MdPerson,
      value: totalUser,
    },
    {
      label: "Jumlah arsip file",
      icon: MdFileCopy,
      value: data?.totalFiles ?? 0,
    },
    {
      label: "Storage digunakan",
      icon: MdStorage,
      value: data?.storage?.driveUsed
        ? formatBytes(data?.storage?.driveUsed)
        : 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Information grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
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
                  <mapper.icon />
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

      {/* Latest uploaded files */}
      <LatestUploadedFiles />
    </div>
  );
};

export default ClientComp;
