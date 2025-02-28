import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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
    const body = await req.json();

    const { nama, deskripsi } = body;

    if (!nama) {
      return new NextResponse("Kolom yang dibutuhkan belum diisi", {
        status: 400,
      });
    }

    const prasaranaKategori = await prisma.prasaranaKategori.create({
      data: {
        nama,
        deskripsi,
      },
    });

    return NextResponse.json(prasaranaKategori);
  } catch (error) {
    console.log("[PRASARANA-KATEGORI_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
