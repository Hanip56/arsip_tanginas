"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import UploadMultipleModal from "./upload-multiple-modal";
import { ArsipKategori } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getByFolderName } from "@/lib/fetcher/drive";
import ShowFiles from "./show-files";

type Props = {
  arsipKategoris: ArsipKategori[];
};

const ClientComp = ({ arsipKategoris }: Props) => {
  const [arsipKategoriId, setArsipKategoriId] = useState(
    arsipKategoris[0]?.id || ""
  );

  const query = useQuery({
    queryKey: ["files", { folderName: arsipKategoriId }],
    queryFn: () => getByFolderName({ folderName: arsipKategoriId }),
  });

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
              onValueChange={(e) => setArsipKategoriId(e)}
            >
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Arsip kategori" />
              </SelectTrigger>
              <SelectContent>
                {arsipKategoris.map((kategori) => (
                  <SelectItem value={kategori.id} key={kategori.id}>
                    {kategori.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-zinc-500 text-xs block mb-2">Urutkan</Label>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">Test</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <SelectWithLabel
            label="Urutkan"
            value={"semua"}
            items={[{ label: "Semua", value: "semua" }]}
            onValueChange={(e) => {}}
            placeholder="Urutkan"
          /> */}
        </div>
        <UploadMultipleModal arsipKategoris={arsipKategoris} />
      </div>

      {/* document */}
      <div className="my-8 px-2 sm:px-0">
        <div className="flex items-center justify-between">
          <h6 className="font-semibold">File</h6>
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
