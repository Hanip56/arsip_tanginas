import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DriveFile } from "@/types/drive";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

const PreviewModal = ({
  file,
  openModal,
  setOpenModal,
}: {
  file: DriveFile;
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const previewUrl = `/api/files/preview?fileId=${file.id}`;

  const handleChange = (open: boolean) => {
    if (!open) {
      setOpenModal(false);
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={handleChange}>
      <DialogContent className="bg-transparent max-w-[100%] h-screen border-none text-white">
        <DialogHeader>
          <DialogTitle>Preview file</DialogTitle>
        </DialogHeader>
        <FileViewer file={file} previewUrl={previewUrl} />
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;

const FileViewer = ({
  file,
  previewUrl,
}: {
  file: DriveFile;
  previewUrl: string;
}) => {
  if (file.mimeType.startsWith("image/"))
    return (
      <Image
        src={previewUrl}
        alt={file.name}
        width={5000}
        height={5000}
        className="w-[90vw] h-[90vh] object-contain"
        unoptimized
      />
    );

  if (
    file.mimeType.includes("word") ||
    file.mimeType.includes("excel") ||
    file.mimeType.includes("powerpoint")
  )
    return (
      <iframe
        src={`https://docs.google.com/gview?url=${encodeURIComponent(
          previewUrl
        )}&embedded=true`}
        // src={`/api/files/preview-doc?fileId=${file.id}`}
        className="w-full h-[90vh] rounded-md shadow-md flex items-center justify-center"
      ></iframe>
    );

  return (
    <iframe
      src={previewUrl}
      className="w-full h-[90vh] rounded-md shadow-md flex items-center justify-center"
    ></iframe>
  );
};
