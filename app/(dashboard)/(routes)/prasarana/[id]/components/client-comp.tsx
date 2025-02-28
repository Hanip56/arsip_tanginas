"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useRef, useState } from "react";
import UploadMultipleModal from "./upload-multiple-modal-with-progress";
import { ArsipKategori } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getByFolderName } from "@/lib/fetcher/drive";
import ShowFiles from "./show-files";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DownloadIcon } from "lucide-react";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import usePushQuery from "@/hooks/use-push-query";

type Props = {
  arsipKategoris: ArsipKategori[];
};

const ClientComp = ({ arsipKategoris }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pushQuery = usePushQuery();

  const abortController = useRef<AbortController | null>(null);
  const [kategoriCount, setKategoriCount] = useState<Record<string, number>>(
    {}
  );

  const prasaranaId = pathname.split("/").reverse()[0];
  const arsipKategoriId =
    searchParams.get("arsipKategoriId") || arsipKategoris[0]?.id || "";

  const query = useQuery({
    queryKey: [
      "files",
      { folderName: arsipKategoriId, parentFolderName: prasaranaId },
    ],
    queryFn: () =>
      getByFolderName({
        folderName: arsipKategoriId,
        parentFolderName: prasaranaId,
      }),
  });

  const downloadAllPromise = () => {
    return new Promise(async (resolve, reject) => {
      abortController.current = new AbortController();
      const { signal } = abortController.current;

      try {
        const response = await axios.get(
          `/api/files/download-folder?folderName=${arsipKategoriId}&parentFolderName=${prasaranaId}`,
          {
            responseType: "blob",
            signal,
            onDownloadProgress: (progressEvent) => {
              const percent = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              console.log(`Download Progress: ${percent}`);
            },
          }
        );

        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `${
          arsipKategoris.find((v) => v.id === arsipKategoriId)?.nama
        }.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
        resolve("Downloaded");
      } catch (error: any) {
        const errorMessage = error?.response?.data || "Gagal mengunduh";
        console.log(error);
        reject(errorMessage);
      }
    });
  };

  const stopDownload = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
  };

  const handleDownloadFolder = () => {
    toast.promise(downloadAllPromise(), {
      cancel: {
        label: "Batal",
        onClick: () => stopDownload(),
      },
      loading: "Downloading",
      success: "Downloaded",
      error: "Gagal mengunduh",
    });
  };

  useEffect(() => {
    const fetchSubFolderCount = async () => {
      const res = await fetch(
        `/api/files/subfolder-count?folderName=${prasaranaId ?? ""}`
      );
      const data = await res.json();

      setKategoriCount(data);
    };

    fetchSubFolderCount();
  }, [prasaranaId]);

  return (
    <div>
      {/* filter */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div>
            <Label className="text-zinc-500 text-xs block mb-2">
              Jenis arsip
            </Label>
            <Select
              value={arsipKategoriId}
              onValueChange={(e) => pushQuery({ arsipKategoriId: e })}
            >
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Arsip kategori" />
              </SelectTrigger>
              <SelectContent>
                {arsipKategoris.map((kategori) => (
                  <SelectItem value={kategori.id} key={kategori.id}>
                    {kategori.nama}{" "}
                    <Badge variant="outline" className="ml-2 text-gray-600">
                      {kategoriCount?.[kategori.id] || 0}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* <div>
            <Label className="text-zinc-500 text-xs block mb-2">Urutkan</Label>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">Test</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          {/* <SelectWithLabel
            label="Urutkan"
            value={"semua"}
            items={[{ label: "Semua", value: "semua" }]}
            onValueChange={(e) => {}}
            placeholder="Urutkan"
          /> */}
        </div>
        <UploadMultipleModal
          arsipKategoris={arsipKategoris}
          currentArsipKategoriId={arsipKategoriId}
        />
      </div>

      {/* document */}
      <div className="my-8 px-2 sm:px-0">
        <div className="flex items-center justify-between">
          <h6 className="font-semibold">File</h6>
          <Button variant="ghost" onClick={handleDownloadFolder}>
            <DownloadIcon className="size-5 mr-2" /> Download All
          </Button>
        </div>

        <ShowFiles
          isError={query.isError}
          isLoading={query.isLoading || query.isPending}
          data={query.data?.files}
          arsipKategoriId={arsipKategoriId}
        />
      </div>
    </div>
  );
};

export default ClientComp;
