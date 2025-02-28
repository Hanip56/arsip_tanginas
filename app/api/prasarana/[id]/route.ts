import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await checkIsAdmin();

    if (!isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    const body = await req.json();
    const id = (await params).id;

    const prasarana = await prisma.prasarana.findUnique({
      where: {
        id,
      },
    });

    if (!prasarana)
      return new NextResponse("Prasarana tidak ditemukan", { status: 404 });

    const updatedPrasarana = await prisma.prasarana.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(updatedPrasarana);
  } catch (error) {
    console.log("[PRASARANA_ID_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const id = (await params).id;

  try {
    const prasarana = await prisma.prasarana.findUnique({
      where: {
        id,
      },
    });

    if (!prasarana)
      return new NextResponse("Prasarana tidak ditemukan", { status: 404 });

    const deletedPrasarana = await prisma.prasarana.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: `Prasarana dengan id:${deletedPrasarana.id} Sudah dihapus.`,
    });
  } catch (error) {
    console.log("[PRASARANA-KATEGORI_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
