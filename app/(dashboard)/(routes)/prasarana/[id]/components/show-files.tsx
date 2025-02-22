import { Skeleton } from "@/components/ui/skeleton";
import { DriveFile } from "@/types/drive";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { FileTextIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import FileCard from "./file-card";

type Props = {
  isError: boolean;
  isLoading: boolean;
  data: DriveFile[] | undefined;
  arsipKategoriId: string;
};

const ShowFiles = ({ isError, isLoading, data, arsipKategoriId }: Props) => {
  if (isError) {
    return (
      <div className="w-full rounded-xl bg-red-100 h-40 flex items-center justify-center text-center text-red-500 font-semibold">
        Error: Telah terjadi kesalahan
      </div>
    );
  }

  if (!isLoading && data?.length === 0) {
    return (
      <div className="w-full rounded-xl bg-gray-100 h-40 flex items-center justify-center text-center">
        File tidak ditemukan
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 py-4">
      {isLoading &&
        Array(4)
          .fill("")
          .map((_, i) => (
            <div key={i} className="relative w-full pt-[100%]">
              <Skeleton className="absolute top-0 left-0 w-full h-full rounded-lg p-4 flex flex-col gap-4">
                <div className="flex items-center gap-4 px-2">
                  <Skeleton className="flex-1 size-6"></Skeleton>
                  <Skeleton className="size-6" />
                </div>
                <Skeleton className="w-full h-full bg-white rounded-lg"></Skeleton>
              </Skeleton>
            </div>
          ))}
      {!isLoading &&
        data?.map((file, i) => (
          <FileCard
            key={file.id}
            file={file}
            arsipKategoriId={arsipKategoriId}
          />
        ))}
    </div>
  );
};

export default ShowFiles;
