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
import axios from "axios";
import { UploadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Dropzone from "./dropzone";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DriveFile } from "@/types/drive";

type Props = {
  arsipKategoris: ArsipKategori[];
  currentArsipKategoriId: string;
};

interface UploadProgress {
  fileName: string;
  progress: number;
}

interface UploadedFile {
  fileName: string;
  fileLink: string;
}

const UploadMultipleModal = ({
  arsipKategoris,
  currentArsipKategoriId,
}: Props) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [arsipKategoriId, setArsipKategoriId] = useState(
    currentArsipKategoriId ?? ""
  );
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const queryClient = useQueryClient();
  const pathname = usePathname();
  const prasaranaId = pathname.split("/").reverse()[0];

  const handleUpload = async () => {
    try {
      if (!files || files.length === 0 || !arsipKategoriId) return;
      setIsLoading(true);

      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));
      formData.append("prasaranaId", prasaranaId);
      formData.append("arsipKategoriId", arsipKategoriId);

      const res = await axios.post("/api/upload", formData);

      toast.success("File uploaded");
      queryClient.invalidateQueries({
        queryKey: ["files", { folderName: arsipKategoriId }],
      });
      setFiles(undefined);
      setOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleUpload();
  }, [files]);

  const handleOpenChange = (open: boolean) => {
    if (!isLoading && !open) {
      setOpen(false);
    }
  };

  const uploadSingleFile = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("prasaranaId", prasaranaId);
      formData.append("arsipKategoriId", arsipKategoriId);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload", true);

      // upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            const foundProgressIndex = newProgress.findIndex(
              (progress) => progress.fileName === file.name
            );
            if (foundProgressIndex !== -1) {
              newProgress[foundProgressIndex].progress = progress;
            } else {
              newProgress.push({ fileName: file.name, progress });
            }

            return newProgress;
          });
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setUploadedFiles((prevFiles) => [
            ...prevFiles,
            { fileName: data.fileName, fileLink: data.fileLink },
          ]);
          resolve();
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Upload error"));
      };

      xhr.send(formData);
    });
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
        <Dropzone disabled={isLoading} setFiles={setFiles} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadMultipleModal;
