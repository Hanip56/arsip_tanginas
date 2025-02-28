"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  daftarSumberDana,
  daftarTahunAnggaran,
  desaKelurahanKabupatenBandung,
  kecamatans,
} from "@/constants";
import { PrasaranaSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prasarana, PrasaranaKategori } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";

// Load Map dynamically to avoid SSR issues
const Map = dynamic(() => import("@/components/map"), { ssr: false });

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData?: Prasarana;
  kategoris: PrasaranaKategori[];
};

const UpsertPrasaranaDialog = ({
  open,
  handleClose,
  initialData,
  kategoris,
}: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [mapPosition, setMapPosition] = useState<LatLngExpression>([
    -7.179925810121978, 107.58499145507812,
  ]); // [lat, lng]

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof PrasaranaSchema>>({
    resolver: zodResolver(PrasaranaSchema),
    defaultValues: {
      nama: initialData?.nama ?? "",
      poktan: initialData?.poktan ?? "",
      alamat: initialData?.alamat ?? "",
      desa: initialData?.desa ?? "",
      kecamatan: initialData?.kecamatan ?? "",
      tahunAnggaran: initialData?.tahunAnggaran ?? "",
      sumberAnggaran: initialData?.sumberAnggaran ?? "",
      volume: initialData?.volume ?? "",
      satuan: initialData?.satuan ?? "",
      status: initialData?.status ?? "",
      jenisLahan: initialData?.jenisLahan ?? "",
      longitude: initialData?.longitude ?? "",
      latitude: initialData?.latitude ?? "",
      bpp: initialData?.bpp ?? "",
      nilaiAnggaran: initialData?.nilaiAnggaran ?? undefined,
      kategoriId: initialData?.kategoriId ?? "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  useEffect(() => {
    if (initialData) {
      form.setValue("nama", initialData.nama);
      form.setValue("kategoriId", initialData.kategoriId);
      form.setValue("poktan", initialData.poktan);
      form.setValue("alamat", initialData.alamat);
      form.setValue("desa", initialData.desa);
      form.setValue("kecamatan", initialData.kecamatan);
      form.setValue("nilaiAnggaran", initialData.nilaiAnggaran);
      form.setValue("tahunAnggaran", initialData.tahunAnggaran);
      form.setValue("sumberAnggaran", initialData.sumberAnggaran);
      form.setValue("volume", initialData.volume);
      form.setValue("satuan", initialData.satuan);
      form.setValue("status", initialData.status);
      form.setValue("jenisLahan", initialData.jenisLahan);
      form.setValue("longitude", initialData.longitude);
      form.setValue("latitude", initialData.latitude);
      form.setValue("bpp", initialData.bpp);
      setMapPosition([
        parseFloat(initialData.latitude),
        parseFloat(initialData.longitude),
      ]);
    }
  }, [initialData, form]);

  useEffect(() => {
    if (mapPosition) {
      const splitted = mapPosition.toString().split(",");
      form.setValue("latitude", splitted[0]);
      form.setValue("longitude", splitted[1]);
    }
  }, [mapPosition, form]);

  const onSubmit = async (values: z.infer<typeof PrasaranaSchema>) => {
    try {
      setIsLoading(true);
      const body = {
        ...values,
      };
      const successMessage = initialData
        ? "Prasarana telah dirubah"
        : "Prasarana telah dibuat";

      if (initialData) {
        // update
        await axios.put(`/api/prasarana/${initialData.id}`, body);
      } else {
        // create
        await axios.post(`/api/prasarana`, body);
      }

      toast.success(successMessage);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["prasaranas"], exact: false });
      handleClose();
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error?.response?.data || error?.message || "Gagal membuat prasarana";
      toast.error(errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-screen-lg p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Tambah prasarana</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4">
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div>
                <div className="text-zinc-500 text-xs mb-1 mt-2">Deskripsi</div>
                <div className="grid grid-cols-1 md:grid-cols-3 [&>*]:flex-1 [&>*]:w-full gap-4">
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nama</FormLabel>
                        <FormControl>
                          <Input
                            className="text-xs placeholder:text-xs"
                            {...field}
                            disabled={isLoading}
                            placeholder="Masukan nama prasarana"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kategoriId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Kategori</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                              {kategoris?.map((kategori) => (
                                <SelectItem
                                  key={kategori.id}
                                  value={kategori.id}
                                  className="text-xs"
                                >
                                  {kategori.nama}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="poktan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Poktan</FormLabel>
                        <FormControl>
                          <Input
                            className="text-xs placeholder:text-xs"
                            {...field}
                            disabled={isLoading}
                            placeholder="Masukan poktan"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alamat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Alamat</FormLabel>
                        <FormControl>
                          <Input
                            className="text-xs placeholder:text-xs"
                            {...field}
                            disabled={isLoading}
                            placeholder="Masukan alamat"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="desa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Desa</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih desa/kelurahan" />
                            </SelectTrigger>
                            <SelectContent>
                              {desaKelurahanKabupatenBandung?.map(
                                (value, i) => (
                                  <SelectItem
                                    key={value}
                                    value={value}
                                    className="text-xs"
                                  >
                                    {value}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="kecamatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Kecamatan</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih kecamatan" />
                            </SelectTrigger>
                            <SelectContent>
                              {kecamatans?.map((kecamatan) => (
                                <SelectItem
                                  key={kecamatan}
                                  value={kecamatan}
                                  className="text-xs"
                                >
                                  {kecamatan}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nilaiAnggaran"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Nilai anggaran
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-xs placeholder:text-xs"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                            placeholder="Nilai anggaran"
                            type="number"
                            min={0}
                            onWheel={(e: any) => e.target.blur()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tahunAnggaran"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Tahun anggaran
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih tahun anggaran" />
                            </SelectTrigger>
                            <SelectContent>
                              {daftarTahunAnggaran?.map((tahun) => (
                                <SelectItem
                                  key={tahun}
                                  value={tahun}
                                  className="text-xs"
                                >
                                  {tahun}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sumberAnggaran"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Sumber anggaran
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih sumber anggaran" />
                            </SelectTrigger>
                            <SelectContent>
                              {daftarSumberDana?.map((tahun) => (
                                <SelectItem
                                  key={tahun}
                                  value={tahun}
                                  className="text-xs"
                                >
                                  {tahun}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="volume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Volume</FormLabel>
                        <FormControl>
                          <Input
                            className="text-xs placeholder:text-xs"
                            {...field}
                            disabled={isLoading}
                            placeholder="Masukan volume"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="satuan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Satuan</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Unit" className="text-xs">
                                Unit
                              </SelectItem>
                              <SelectItem value="Meter" className="text-xs">
                                Meter
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Terbangun" className="text-xs">
                                Terbangun
                              </SelectItem>
                              <SelectItem
                                value="Tidak Terbangun"
                                className="text-xs"
                              >
                                Tidak Terbangun
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jenisLahan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Jenis lahan</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="LSD" className="text-xs">
                                LSD
                              </SelectItem>
                              <SelectItem value="BUKAN LSD" className="text-xs">
                                BUKAN LSD
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bpp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">BPP</FormLabel>
                        <FormControl>
                          <Input
                            className="text-xs placeholder:text-xs"
                            {...field}
                            disabled={isLoading}
                            placeholder="Masukan bpp"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Map */}
              <div className="mt-8">
                <div className="text-zinc-500 text-xs mb-1 mt-2">Map</div>
                {/* map */}
                <Map position={mapPosition} setPosition={setMapPosition} />
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Longitude</FormLabel>
                        <FormControl>
                          <Input
                            className="text-xs placeholder:text-xs"
                            {...field}
                            disabled={isLoading}
                            placeholder="Masukan longitude"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Latitude</FormLabel>
                        <FormControl>
                          <Input
                            className="text-xs placeholder:text-xs"
                            {...field}
                            disabled={isLoading}
                            placeholder="Masukan latitude"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 pt-3">
              <Button className="w-full" disabled={isLoading}>
                {initialData ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertPrasaranaDialog;
