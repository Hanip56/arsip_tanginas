import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!file) {
      return new NextResponse("File is required", { status: 400 });
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const allKategori = await prisma.prasaranaKategori.findMany();
    const SetAllKategori = new Set(
      allKategori.map((item) => item.nama.toLowerCase())
    );

    if (jsonData && jsonData.length > 0) {
      // Detect unknown kategori and create it
      const kategoris = [
        ...new Set(jsonData.map((data: any) => data?.["Kategori"]?.trim())),
      ];

      const differenceNames = kategoris.filter(
        (kategori) => !SetAllKategori.has(kategori.toLowerCase())
      );

      if (differenceNames.length > 0) {
        await prisma.prasaranaKategori.createMany({
          data: differenceNames.map((nama) => ({ nama })),
        });
      }

      // Select all new kategori
      const newAllKategori = await prisma.prasaranaKategori.findMany();

      // map kategori nama & id to easy lookup
      const KategoriMapId = new Map(
        newAllKategori.map((kategori) => [
          kategori.nama.toLowerCase(),
          kategori.id,
        ])
      );

      // Change json data value to insertable
      const insertableData = jsonData.map((data: any) => ({
        nama: data?.["Nama"]?.trim() ?? "",
        kategoriId:
          KategoriMapId.get(data?.["Kategori"]?.trim().toLowerCase()) ?? "",
        poktan: data?.["Poktan"]?.trim() ?? "",
        alamat: data?.["Alamat"]?.trim() ?? "",
        desa: data?.["Desa"]?.trim() ?? "",
        kecamatan: data?.["Kecamatan"]?.trim() ?? "",
        nilaiAnggaran: data?.["Nilai Anggaran"],
        tahunAnggaran: data?.["Tahun Anggaran"]?.trim() ?? "",
        sumberAnggaran: data?.["Sumber Anggaran"]?.trim() ?? "",
        volume: data?.["Volume"]?.trim() ?? "",
        satuan: data?.["Satuan"]?.trim() ?? "",
        status: data?.["Kondisi"]?.trim() ?? "",
        jenisLahan: data?.["Jenis Lahan"]?.trim() ?? "",
        longitude: data?.["Longitude"]?.trim() ?? "",
        latitude: data?.["Latitude"]?.trim() ?? "",
        bpp: data?.["BPP"]?.trim() ?? "",
        userId: currentUser.id,
      }));

      // create all the prasarana
      await prisma.prasarana.createMany({
        data: insertableData,
      });
    }

    return NextResponse.json("No content");
  } catch (error) {
    console.log("[PRASARANA-IMPORT_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
