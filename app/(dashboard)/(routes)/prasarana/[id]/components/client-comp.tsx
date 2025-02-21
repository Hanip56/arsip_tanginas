"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectWithLabel from "@/components/ui/select-with-label";
import { arsipKategori } from "@/constants/arsip";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { FileTextIcon, UploadIcon } from "lucide-react";
import React from "react";
import UploadSingleModal from "./upload-single-modal";

const ClientComp = () => {
  return (
    <div>
      {/* filter */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div>
            <Label className="text-zinc-500 text-xs block mb-2">
              Jenis arsip
            </Label>
            <Select>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Arsip kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua</SelectItem>
                {arsipKategori.map((kategori) => (
                  <SelectItem value={kategori} key={kategori}>
                    {kategori}
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
        <UploadSingleModal />
      </div>

      {/* document */}
      <div className="my-8 px-2 sm:px-0">
        <div className="flex items-center justify-between">
          <h6 className="font-semibold">File</h6>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 py-4">
          {Array(4)
            .fill("")
            .map((_, i) => (
              <div key={i} className="relative w-full pt-[100%]">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-100 rounded-lg p-4 flex flex-col gap-4">
                  <header className="flex items-center gap-4 px-2">
                    <FileTextIcon className="size-4" />
                    <div className="flex-1 text-[0.925rem] font-medium line-clamp-1">
                      Some document title
                    </div>
                    <DotsVerticalIcon className="size-4" />
                  </header>
                  <main className="w-full h-full bg-white rounded-lg"></main>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClientComp;
