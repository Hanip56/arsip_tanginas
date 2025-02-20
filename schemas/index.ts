import { z } from "zod";

export const PrasaranaSchema = z.object({
  nama: z.string().min(1, {
    message: "Kolom nama harus diisi",
  }),
  kategoriId: z.string().min(1, {
    message: "Kolom kategori harus diisi",
  }),
  poktan: z.string().min(1, {
    message: "Kolom poktan harus diisi",
  }),
  alamat: z.string().min(1, {
    message: "Kolom alamat harus diisi",
  }),
  desa: z.string().min(1, {
    message: "Kolom desa harus diisi",
  }),
  kecamatan: z.string().min(1, {
    message: "Kolom kecamatan harus diisi",
  }),
  nilaiAnggaran: z.number({
    message: "Kolom nilaiAnggaran harus diisi",
  }),
  tahunAnggaran: z.string().min(1, {
    message: "Kolom tahun anggaran harus diisi",
  }),
  sumberAnggaran: z.string().min(1, {
    message: "Kolom sumber anggaran harus diisi",
  }),
  volume: z.string().min(1, {
    message: "Kolom volume harus diisi",
  }),
  satuan: z.string().min(1, {
    message: "Kolom satuan harus diisi",
  }),
  status: z.string().min(1, {
    message: "Kolom status harus diisi",
  }),
  jenisLahan: z.string().min(1, {
    message: "Kolom jenisLahan harus diisi",
  }),
  bpp: z.string().min(1, {
    message: "Kolom bpp harus diisi",
  }),
  longitude: z.string().min(1, {
    message: "Kolom longitude harus diisi",
  }),
  latitude: z.string().min(1, {
    message: "Kolom latitude harus diisi",
  }),
});
