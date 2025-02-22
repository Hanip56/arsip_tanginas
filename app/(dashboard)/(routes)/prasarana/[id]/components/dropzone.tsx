"use client";

import { cn } from "@/lib/utils";
import { UploadCloudIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  disabled: boolean;
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
};

const Dropzone = ({ disabled, setFiles }: Props) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
  });

  return (
    <div
      className={cn(
        "h-60 w-full cursor-pointer border-dashed border-2 rounded-lg p-4 flex items-center justify-center",
        isDragActive && "bg-sky-100 border-sky-500 disabled:cursor-not-allowed"
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {disabled && (
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-sky-700 border-t-transparent animate-spin" />
          <p className="text-gray-500">Uploading...</p>
        </div>
      )}
      {!disabled &&
        (isDragActive ? (
          <div className="flex flex-col items-center gap-4">
            <UploadCloudIcon className="size-20" color="#0369a1" />
            <p className="font-medium text-sky-700">Drop the files here</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <UploadCloudIcon className="size-20" />
            <p>
              Drag and drop, or{" "}
              <span className="font-semibold text-sky-700">browse</span> files
            </p>
          </div>
        ))}
    </div>
  );
};

export default Dropzone;
