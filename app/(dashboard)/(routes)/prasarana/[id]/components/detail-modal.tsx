import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DriveFile } from "@/types/drive";
import React, { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import { formatBytes } from "@/lib/utils";
import { id } from "date-fns/locale";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  file: DriveFile;
};

const DetailModal = ({ open, setOpen, file }: Props) => {
  const handleChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
    }
  };

  const listDetail = [
    {
      label: "Nama",
      content: file.name,
    },
    {
      label: "Ukuran",
      content: formatBytes(+file.size),
    },
    {
      label: "MimeType",
      content: file.mimeType,
    },
    {
      label: "Dibuat",
      content: format(file.createdTime, "dd-MM-yyyy", { locale: id }),
    },
    {
      label: "Diperbarui",
      content: format(file.modifiedTime, "dd-MM-yyyy", { locale: id }),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={handleChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle>Detail file</DialogTitle>
        </DialogHeader>
        {listDetail.map((v) => (
          <div key={v.label}>
            <h6 className="text-xs font-semibold mb-1">{v.label}</h6>
            <p>{v.content}</p>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
