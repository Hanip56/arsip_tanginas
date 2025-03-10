"use client";

import SingleInputDropzone from "@/components/single-input-dropzone";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { ImageType } from "@/schemas/file";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrasaranaKategori } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UploadCloudIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const KategoriSchema = z.object({
  nama: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  deskripsi: z.string().optional(),
  image: ImageType,
});

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData?: PrasaranaKategori;
};

const UpsertKategoriModal = ({ open, handleClose, initialData }: Props) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof KategoriSchema>>({
    resolver: zodResolver(KategoriSchema),
    defaultValues: {
      nama: initialData?.nama ?? "",
      deskripsi: initialData?.deskripsi ?? "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.setValue("nama", "");
      form.setValue("deskripsi", "");
      form.setValue("image", undefined);
    }

    if (initialData?.nama) {
      form.setValue("nama", initialData.nama);
      form.setValue("deskripsi", initialData?.deskripsi ?? "");
    }
  }, [initialData, form, open]);

  const onSubmit = async (values: z.infer<typeof KategoriSchema>) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("nama", values.nama);
      formData.append("deskripsi", values.deskripsi ?? "");
      if (values.image) {
        formData.append("image", values.image);
      }

      const successMessage = initialData
        ? "Kategori telah dirubah"
        : "Kategori telah dibuat";

      if (initialData) {
        // update
        await axios.put(`/api/prasarana-kategori/${initialData.id}`, formData);
      } else {
        // create
        await axios.post(`/api/prasarana-kategori`, formData);
      }

      toast.success(successMessage);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["kategoris"], exact: false });
      handleClose();
    } catch (error: any) {
      const errorMessage = error?.response?.data || "Gagal membuat kategori";
      toast.error(errorMessage);
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Modal
      title={initialData ? "Rubah kategori" : "Buat kategori"}
      description=""
      isOpen={open}
      onClose={handleClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name={"nama"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder="Masukan nama kategori"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"deskripsi"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder="Masukan deskripsi kategori"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"image"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gambar</FormLabel>
                <FormControl>
                  <SingleInputDropzone
                    file={field.value}
                    setFile={(e) => field.onChange(e)}
                    disabled={isLoading}
                    preImageSrc={initialData?.imageUrl ?? undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading}>
            {initialData ? "Rubah" : "Tambah"}
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default UpsertKategoriModal;
