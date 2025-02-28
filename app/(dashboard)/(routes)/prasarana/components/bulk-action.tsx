import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteMultiple } from "@/lib/fetcher/prasarana";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

type Props = {
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;
};

const BulkAction = ({ setSelectedIds, selectedIds }: Props) => {
  const queryClient = useQueryClient();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Apa kamu yakin?",
    `Prasarana terpilih akan dihapus`
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
      setSelectedIds([]);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data || "Gagal menghapus prasarana";
      toast.error(errorMessage, {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    deleteMutation.mutate({ ids: selectedIds });
  };

  const disabled = deleteMutation.isPending || selectedIds.length < 1;

  return (
    <>
      <ConfirmationDialog />
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={disabled}
          size="xs"
          variant="outline"
          onClick={() => setSelectedIds([])}
        >
          Kosongkan
        </Button>
        <Button
          disabled={disabled}
          size="xs"
          className="bg-rose-600 hover:bg-rose-600/80"
          onClick={handleDelete}
        >
          Hapus
        </Button>
      </div>
    </>
  );
};

export default BulkAction;
