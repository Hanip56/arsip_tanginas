import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const id = (await params).id;

    const prasaranaKategori = await prisma.prasaranaKategori.findUnique({
      where: {
        id,
      },
    });

    if (!prasaranaKategori)
      return new NextResponse("Prasarana kategori not found", { status: 404 });

    const updatedPrasaranaKategori = await prisma.prasaranaKategori.update({
      where: {
        id,
      },
      data: {
        nama: body.nama ?? undefined,
        deskripsi: body.deskripsi ?? undefined,
      },
    });

    return NextResponse.json(updatedPrasaranaKategori);
  } catch (error) {
    console.log("[PRASARANA-KATEGORI_ID_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  try {
    const prasaranaKategori = await prisma.prasaranaKategori.findUnique({
      where: {
        id,
      },
    });

    if (!prasaranaKategori)
      return new NextResponse("Prasarana kategori not found", { status: 404 });

    const deletedPrasaranaKategori = await prisma.prasaranaKategori.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: `Prasarana kategori with id:${deletedPrasaranaKategori.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[PRASARANA-KATEGORI_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
