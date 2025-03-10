import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DownloadIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PiExportLight } from "react-icons/pi";
import ImportDropzone from "./import-dropzone";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const ImportDialog = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleImport = async () => {
    try {
      if (!file) {
        throw new Error("File is required");
      }
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosInstance.post("/prasarana/import", formData);

      setOpen(false);
      setFile(undefined);

      queryClient.invalidateQueries({ queryKey: ["prasaranas"], exact: false });
      toast.success("Import Berhasil");
    } catch (error) {
      console.log(error);
      toast.error("Import Gagal");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (file) {
      handleImport();
    }
  }, [file]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && setOpen(false)}>
      <DialogTrigger asChild>
        <Button
          type="button"
          onClick={() => setOpen(true)}
          variant="outline"
          className="text-[0.65rem]"
        >
          <PiExportLight className="mr-2" />
          IMPORT
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import data</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <a href="/format_import_prasarana.xlsx" download>
            <Button variant="outline" className="w-full mb-4">
              <DownloadIcon className="size-4 mr-3 " /> Download Format
            </Button>
          </a>

          <ImportDropzone disabled={isLoading} setFile={setFile} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
