"use client";

import { cn } from "@/lib/utils";
import { UploadCloudIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  disabled: boolean;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
};

const ImportDropzone = ({ disabled, setFile }: Props) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles?.[0]);
    },
    [setFile]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    onDrop,
    disabled,
    accept: {
      "application/vnd.ms-excel": [], // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [], // .xlsx
    },
    multiple: false,
  });

  return (
    <div
      className={cn(
        "max-h-[60vh] overflow-y-auto w-full border-dashed border-2 rounded-lg p-4 flex items-center justify-center",
        isDragActive &&
          isDragAccept &&
          "bg-sky-100 border-sky-500 disabled:cursor-not-allowed",
        isDragReject && "bg-red-100 border-red-500 disabled:cursor-not-allowed",
        !disabled && "cursor-pointer"
      )}
      {...getRootProps()}
    >
      <input className="sr-only" {...getInputProps()} />
      {disabled && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-full border-4 border-t-transparent animate-spin" />
            <p className="text-gray-500">Importing...</p>
          </div>
        </div>
      )}
      {!disabled &&
        (isDragActive && isDragAccept ? (
          <div className="flex flex-col items-center justify-center gap-4 h-60">
            <UploadCloudIcon className="size-20" color="#0369a1" />
            <p className="font-medium text-sky-700">Simpan file disini</p>
          </div>
        ) : isDragReject ? (
          <div className="flex flex-col items-center justify-center gap-4 h-60">
            <UploadCloudIcon className="size-20" color="#ef4444" />
            <p className="font-medium text-red-500">Format file tidak cocok.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 h-60">
            <UploadCloudIcon className="size-20" />
            <p>
              Pilih file sesuai{" "}
              <span className="font-semibold text-sky-700">Format</span> diatas
              (.xlsx)
            </p>
          </div>
        ))}
    </div>
  );
};

export default ImportDropzone;
