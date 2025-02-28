import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { UploadIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const UploadSingleModal = () => {
  const [file, setFile] = useState<File | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileId, setUploadedFileId] = useState("");

  const handleUpload = async () => {
    try {
      if (!file) return;
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/upload", formData);

      console.log({ res });
    } catch (error: any) {
      const errorMessage = error?.response?.data || "Gagal mengupload";
      console.log(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UploadIcon className="size-4 mr-3" /> Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload single file</DialogTitle>
        </DialogHeader>
        <Input
          onChange={(e) => setFile(e.target.files?.[0])}
          type="file"
          placeholder="Upload file"
        />
        <Button disabled={isLoading} onClick={handleUpload}>
          Upload
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UploadSingleModal;
