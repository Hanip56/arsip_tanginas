"use client";

import { useConfirm } from "@/hooks/use-confirm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteOne } from "@/lib/fetcher/arsip-kategori";
import RowOptionGeneral from "@/components/row-option-general";
import { ColumnType } from "./columns";

type CellActionProps = {
  data: ColumnType;
  handleOpenUpdate: (id: string) => void;
};

const CellAction: React.FC<CellActionProps> = ({ data, handleOpenUpdate }) => {
  const queryClient = useQueryClient();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    `You'll delete this kategori`
  );

  const deleteMutation = useMutation({
    mutationFn: deleteOne,
    onSuccess: (data) => {
      toast(`This kategori has been deleted.`, {
        className: "text-emerald-600 font-semibold",
      });

      queryClient.invalidateQueries({
        queryKey: [`arsip-kategoris`],
        exact: false,
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data || "Gagal menghapus kategori";
      toast(errorMessage, {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    deleteMutation.mutate(data.id);
  };

  return (
    <>
      <ConfirmationDialog />
      <RowOptionGeneral
        detailHref={``}
        handleUpdate={() => handleOpenUpdate(data.id)}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default CellAction;
