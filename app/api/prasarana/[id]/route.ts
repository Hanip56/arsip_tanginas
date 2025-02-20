import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const id = (await params).id;

    const prasarana = await prisma.prasarana.findUnique({
      where: {
        id,
      },
    });

    if (!prasarana)
      return new NextResponse("Prasarana not found", { status: 404 });

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
  const id = (await params).id;

  try {
    const prasarana = await prisma.prasarana.findUnique({
      where: {
        id,
      },
    });

    if (!prasarana)
      return new NextResponse("Prasarana not found", { status: 404 });

    const deletedPrasarana = await prisma.prasarana.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: `Prasarana with id:${deletedPrasarana.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[PRASARANA-KATEGORI_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
