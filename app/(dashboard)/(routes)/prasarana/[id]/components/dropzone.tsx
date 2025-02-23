"use client";

import { cn } from "@/lib/utils";
import { UploadCloudIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadProgress } from "./upload-multiple-modal-with-progress";
import { Progress } from "@/components/ui/progress";

type Props = {
  disabled: boolean;
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
  uploadProgress: UploadProgress[];
};

const Dropzone = ({ disabled, setFiles, uploadProgress }: Props) => {
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
        "max-h-[60vh] overflow-y-auto w-full border-dashed border-2 rounded-lg p-4 flex items-center justify-center",
        isDragActive && "bg-sky-100 border-sky-500 disabled:cursor-not-allowed",
        !disabled && "cursor-pointer"
      )}
      {...getRootProps()}
    >
      <input className="sr-only" {...getInputProps()} />
      {disabled && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-full border-4 border-t-transparent animate-spin" />
            <p className="text-gray-500">Uploading...</p>
          </div>
          <div className="w-full flex flex-col items-center gap-4">
            {uploadProgress.map((file, i) => (
              <div
                key={i}
                className="flex-1 flex-grow text-sm font-medium flex flex-col w-full p-4 items-center gap-4 border rounded-lg"
              >
                <div className="break-all w-full">{file.fileName}</div>
                <Progress value={file.progress} className="w-full"></Progress>
              </div>
            ))}
          </div>
        </div>
      )}
      {!disabled &&
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

export default Dropzone;
