import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DriveFile } from "@/types/drive";
import { DotsVerticalIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { DownloadIcon, FileTextIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import PreviewModal from "./preview-modal";
import { MdOpenInFull } from "react-icons/md";
import { useConfirm } from "@/hooks/use-confirm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFileById } from "@/lib/fetcher/drive";
import DetailModal from "./detail-modal";
import axios from "axios";

type Props = {
  file: DriveFile;
  arsipKategoriId: string;
};

const FileCard = ({ file, arsipKategoriId }: Props) => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [ConfirmationDialog, confirm] = useConfirm(
    "Apa kamu yakin?",
    `Kamu akan menghapus file ini`
  );
  const abortController = useRef<AbortController | null>(null);

  const downloadPromise = () => {
    return new Promise(async (resolve, reject) => {
      abortController.current = new AbortController();
      const { signal } = abortController.current;

      try {
        const res = await axios.get(`/api/files/download?fileId=${file.id}`, {
          responseType: "blob",
          signal,
          onDownloadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            console.log(`Download Progress: ${percent}`);
          },
        });

        const blob = new Blob([res.data], { type: file.mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = file.name || "downloaded-file";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
        resolve("Downloaded");
      } catch (error) {
        console.log(error);
        reject("Batal mengunduh");
      }
    });
  };

  const stopDownload = () => {
    abortController.current?.abort();
  };

  const handleDownload = () => {
    toast.promise(downloadPromise(), {
      loading: "Downloading",
      success: "Downloaded",
      error: "Batal mengunduh",
      cancel: {
        label: "Batal",
        onClick: () => stopDownload(),
      },
    });
  };

  const deletePromise = () => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const res = await deleteFileById({ fileId: file.id });

        queryClient.invalidateQueries({
          queryKey: ["files", { folderName: arsipKategoriId }],
          exact: false,
        });
        resolve();
      } catch (error) {
        reject("Gagal menghapus");
      }
    });
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    toast.promise(deletePromise(), {
      loading: "Menghapus...",
      success: "Berhasil menghapus",
      error: "Gagal menghapus",
    });
  };

  return (
    <>
      <PreviewModal
        file={file}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <DetailModal
        open={openDetailModal}
        setOpen={setOpenDetailModal}
        file={file}
      />
      <ConfirmationDialog />
      <div className="relative w-full pt-[100%]">
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200/70 hover:bg-gray-200 transition-colors rounded-lg p-4 flex flex-col gap-4">
          <header className="flex items-center gap-4 px-2">
            <FileTextIcon className="size-4" />
            <div className="flex-1 text-[0.925rem] font-medium line-clamp-1">
              {file.name}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="size-8" variant="ghost">
                  <DotsVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setOpenModal(true)}>
                    <MdOpenInFull className="size-6" /> Pratinjau
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOpenDetailModal(true)}>
                    <MagnifyingGlassIcon className="size-6" />
                    Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <DownloadIcon className="size-6" /> Download
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleDelete}>
                    <TrashIcon className="size-6" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="w-full h-full bg-white rounded-lg overflow-hidden">
            {file.hasThumbnail && (
              <Image
                src={file.thumbnailLink}
                alt={file.name}
                width={2000}
                height={2000}
                className="w-full h-full object-cover"
              />
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default FileCard;
