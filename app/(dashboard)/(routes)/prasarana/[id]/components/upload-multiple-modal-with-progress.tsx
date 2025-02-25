import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArsipKategori } from "@prisma/client";
import { UploadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Dropzone from "./dropzone";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  arsipKategoris: ArsipKategori[];
  currentArsipKategoriId: string;
};

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "done" | "canceled";
  abortController?: AbortController;
}

const UploadMultipleModal = ({
  arsipKategoris,
  currentArsipKategoriId,
}: Props) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [arsipKategoriId, setArsipKategoriId] = useState(
    currentArsipKategoriId ?? ""
  );
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [abortControllers, setAbortControllers] = useState<AbortController[]>(
    []
  );

  const queryClient = useQueryClient();
  const pathname = usePathname();
  const prasaranaId = pathname.split("/").reverse()[0];

  const handleUpload = async () => {
    try {
      if (!files || files.length === 0 || !arsipKategoriId) return;

      setIsUploading(true);
      // reseter
      setUploadProgress([]);
      setAbortControllers([]);

      // 2️⃣ Upload each file individually with abortController & progress tracking
      for (const file of files) {
        const controller = new AbortController();
        setAbortControllers((prev) => [...prev, controller]);
        await uploadSingleFile(file, controller);
      }

      toast.success("File uploaded");
      queryClient.invalidateQueries({
        queryKey: ["files", { folderName: arsipKategoriId }],
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      setFiles(undefined);
      setOpen(false);
    }
  };

  useEffect(() => {
    setArsipKategoriId(currentArsipKategoriId);
  }, [currentArsipKategoriId]);

  useEffect(() => {
    handleUpload();
  }, [files]);

  const handleOpenChange = (open: boolean) => {
    if (!isUploading && !open) {
      setOpen(false);
    }
  };

  const uploadSingleFile = (file: File, controller: AbortController) => {
    return new Promise<void>((resolve, reject) => {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("prasaranaId", prasaranaId);
      formData.append("arsipKategoriId", arsipKategoriId);

      const signal = controller.signal;

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);

      // Initialize progress at 0 for this file
      setUploadProgress((prevProgress) => [
        ...prevProgress,
        {
          fileName: file.name,
          progress: 0,
          status: "uploading",
          abortController: controller,
        },
      ]);

      // upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress((prevProgress) => {
            return prevProgress.map((p) =>
              p.fileName === file.name ? { ...p, progress } : p
            );
          });
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          // const data = JSON.parse(xhr.responseText);
          // setUploadedFiles((prevFiles) => [
          //   ...prevFiles,
          //   { fileName: data.fileName, fileLink: data.fileLink },
          // ]);
          resolve();
        } else {
          reject(new Error("Upload failed"));
        }
      };

      signal.addEventListener("abort", () => {
        xhr.abort();
        setUploadProgress((prevProgress) =>
          prevProgress.map((p) =>
            p.fileName === file.name
              ? { ...p, status: "canceled", progress: 0 }
              : p
          )
        );
        reject(new Error("Upload aborted"));
      });

      xhr.onerror = () => {
        reject(new Error("Upload error"));
      };

      xhr.send(formData);
    });
  };

  const cancelAllUploads = () => {
    abortControllers.forEach((controller) => controller.abort());

    setUploadProgress((prevProgress) =>
      prevProgress.map((p) =>
        p.status === "uploading" ? { ...p, status: "canceled", progress: 0 } : p
      )
    );

    setIsUploading(false);
    toast.info("Ongoing upload canceled");
    queryClient.invalidateQueries({
      queryKey: ["files", { folderName: arsipKategoriId }],
    });
    setFiles(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <UploadIcon className="size-4 mr-3" /> Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
        </DialogHeader>
        {/* select jenis arsip */}
        {!isUploading && (
          <div>
            <Label className="mb-2 block">Jenis arsip</Label>
            <Select
              value={arsipKategoriId}
              onValueChange={(e) => setArsipKategoriId(e)}
            >
              <SelectTrigger className="w-full">
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
        )}
        {isUploading && (
          <Button
            variant="destructive"
            className="w-full"
            size="sm"
            onClick={cancelAllUploads}
          >
            Cancel
          </Button>
        )}
        {/* cancel upload */}
        <Dropzone
          disabled={isUploading}
          setFiles={setFiles}
          uploadProgress={uploadProgress}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadMultipleModal;
