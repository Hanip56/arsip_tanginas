"use client";

import { useConfirm } from "@/hooks/use-confirm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMultiple } from "@/lib/fetcher/prasarana";
import { ColumnType } from "./columns";
import RowOptionPrasarana from "@/components/row-option-prasarana";

type CellActionProps = {
  data: ColumnType;
  handleOpenUpdate: (id: string) => void;
};

const CellAction: React.FC<CellActionProps> = ({ data, handleOpenUpdate }) => {
  const queryClient = useQueryClient();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    `Prasarana ini akan dihapus`
  );

  const deleteMutation = useMutation({
    mutationFn: deleteMultiple,
    onSuccess: (data) => {
      toast(`Prasarana telah dihapus.`, {
        className: "text-emerald-600 font-semibold",
      });

      queryClient.invalidateQueries({
        queryKey: [`prasaranas`],
        exact: false,
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data || "Gagal menghapus prasarana";
      toast(errorMessage, {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    deleteMutation.mutate({ ids: [data.id] });
  };

  return (
    <>
      <ConfirmationDialog />
      <RowOptionPrasarana
        detailHref={`prasarana/${data.id}`}
        handleUpdate={() => handleOpenUpdate(data.id)}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default CellAction;
