import { KATEGORI_THUMBNAIL_FOLDER_ID } from "@/constants/google-drive";
import prisma from "@/lib/db";
import { drive, uploadFile } from "@/lib/google-drive";
import { checkIsAdmin } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

export async function GET(req: NextRequest) {
  try {
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 1;
    const updatedAt = req.nextUrl.searchParams.get("updatedAt") || "desc";
    const search = req.nextUrl.searchParams.get("search") || "";

    let orderBy: Record<string, string> = {};

    if (typeof updatedAt === "string") {
      orderBy = {
        updatedAt,
      };
    }

    const where: Prisma.PrasaranaKategoriWhereInput = {
      nama: { contains: search, mode: "insensitive" },
    };

    const total_items = await prisma.prasaranaKategori.count({
      where,
    });

    const prasaranaKategoris = await prisma.prasaranaKategori.findMany({
      where,
      take: limit,
      skip: limit * (page - 1),
      orderBy,
    });

    return NextResponse.json({
      data: prasaranaKategoris,
      total_items,
    });
  } catch (error) {
    console.log("[PRASARANA-KATEGORI_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await checkIsAdmin();

    if (!isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const formData = await req.formData();

    const nama = formData.get("nama") as string;
    const deskripsi = formData.get("deskripsi") as string | undefined;
    const image = formData.get("image") as File | undefined;

    if (!nama) {
      return new NextResponse("Kolom yang dibutuhkan belum diisi", {
        status: 400,
      });
    }

    let imageUrl: string | null | undefined = undefined;

    if (image) {
      const { webContentLink } = await uploadFile(
        image,
        KATEGORI_THUMBNAIL_FOLDER_ID
      );

      imageUrl = webContentLink;
    }

    const arsipKategori = await prisma.prasaranaKategori.create({
      data: {
        nama,
        deskripsi,
        imageUrl,
      },
    });

    return NextResponse.json(arsipKategori);
  } catch (error) {
    console.log("[PRASARANA-KATEGORI_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
