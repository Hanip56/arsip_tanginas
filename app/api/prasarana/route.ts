import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-utils";
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

    const where: Prisma.PrasaranaWhereInput = {
      nama: { contains: search, mode: "insensitive" },
    };

    const total_items = await prisma.prasarana.count({
      where,
    });

    const prasaranas = await prisma.prasarana.findMany({
      where,
      include: {
        kategori: true,
        user: true,
      },
      take: limit,
      skip: limit * (page - 1),
      orderBy,
    });

    return NextResponse.json({
      data: prasaranas,
      total_items,
    });
  } catch (error) {
    console.log("[PRASARANA_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();

    const {
      nama,
      poktan,
      alamat,
      desa,
      kecamatan,
      nilaiAnggaran,
      tahunAnggaran,
      sumberAnggaran,
      volume,
      satuan,
      status,
      jenisLahan,
      longitude,
      latitude,
      bpp,
      kategoriId,
    } = body;

    if (
      !nama ||
      !poktan ||
      !alamat ||
      !desa ||
      !kecamatan ||
      !nilaiAnggaran ||
      !tahunAnggaran ||
      !sumberAnggaran ||
      !volume ||
      !satuan ||
      !status ||
      !jenisLahan ||
      !longitude ||
      !latitude ||
      !bpp ||
      !kategoriId
    ) {
      return new NextResponse("Required field is missing", { status: 400 });
    }

    const prasarana = await prisma.prasarana.create({
      data: {
        nama,
        poktan,
        alamat,
        desa,
        kecamatan,
        nilaiAnggaran,
        tahunAnggaran,
        sumberAnggaran,
        volume,
        satuan,
        status,
        jenisLahan,
        longitude,
        latitude,
        bpp,
        kategoriId,
        userId: user.id,
      },
    });

    return NextResponse.json(prasarana);
  } catch (error) {
    console.log("[PRASARANA_POST]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
