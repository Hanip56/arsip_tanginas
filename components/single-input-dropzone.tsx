"use client";

import { cn } from "@/lib/utils";
import { UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  disabled: boolean;
  file: File;
  setFile: (e: File) => void;
  preImageSrc?: string;
};

const SingleInputDropzone = ({
  disabled,
  file,
  setFile,
  preImageSrc,
}: Props) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles?.[0]);
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
  });

  const hasPreview = file || preImageSrc;

  return (
    <div
      className={cn(
        "max-h-[60vh] overflow-y-auto w-full border-dashed border-2 rounded-lg p-4 flex items-center justify-center",
        isDragActive && "bg-sky-100 border-sky-500 disabled:cursor-not-allowed",
        !disabled && "cursor-pointer"
      )}
      {...getRootProps()}
    >
      <input className="sr-only" {...getInputProps()} />
      {hasPreview && (
        <div>
          <Image
            src={file ? URL.createObjectURL(file) : preImageSrc ?? ""}
            alt=""
            width={1000}
            height={1000}
            className="size-60 object-cover"
          />
        </div>
      )}
      {!disabled &&
        !hasPreview &&
        (isDragActive ? (
          <div className="flex flex-col items-center justify-center gap-4 h-60">
            <UploadCloudIcon className="size-20" color="#0369a1" />
            <p className="font-medium text-sky-700">Drop the files here</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 h-60">
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

export default SingleInputDropzone;
