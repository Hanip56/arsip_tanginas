"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { roles } from "@/constants/role";
import { ArsipKategoriWithAccess } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrasaranaKategori } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
  access: z.array(z.string()),
});

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData?: ArsipKategoriWithAccess;
};

const UpsertKategoriModal = ({ open, handleClose, initialData }: Props) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof KategoriSchema>>({
    resolver: zodResolver(KategoriSchema),
    defaultValues: {
      nama: initialData?.nama ?? "",
      deskripsi: initialData?.deskripsi ?? "",
      access: [],
    },
  });

  useEffect(() => {
    if (!open) {
      form.setValue("nama", "");
      form.setValue("deskripsi", "");
    }

    if (initialData?.nama) {
      form.setValue("nama", initialData.nama);
      form.setValue("deskripsi", initialData?.deskripsi ?? "");
      form.setValue("access", initialData?.access.map((a) => a.role) ?? []);
    }
  }, [initialData, form, open]);

  const onSubmit = async (values: z.infer<typeof KategoriSchema>) => {
    try {
      setIsLoading(true);
      const body = {
        nama: values.nama,
        deskripsi: values.deskripsi,
        access: values.access,
      };
      const successMessage = initialData
        ? "Kategori telah dirubah"
        : "Kategori telah dibuat";

      if (initialData) {
        // update
        await axios.put(`/api/arsip-kategori/${initialData.id}`, body);
      } else {
        // create
        await axios.post(`/api/arsip-kategori`, body);
      }

      toast.success(successMessage);
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["arsip-kategoris"],
        exact: false,
      });
      handleClose();
    } catch (error: any) {
      console.log(error);
      const errorMessage = error?.response?.data || "Gagal membuat kategori";
      toast.error(errorMessage);
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
                <div className="mb-4">
                  <FormLabel className="text-base">Akses</FormLabel>
                  <FormDescription>
                    Beri akses kepada user dengan role:
                  </FormDescription>
                </div>
                {roles.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="access"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
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
