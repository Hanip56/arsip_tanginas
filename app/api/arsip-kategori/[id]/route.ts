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
    const { access } = body;

    const arsipKategori = await prisma.arsipKategori.findUnique({
      where: {
        id,
      },
    });

    if (!arsipKategori)
      return new NextResponse("Arsip kategori tidak ditemukan", {
        status: 404,
      });

    const accessMapper =
      access && access.length > 0
        ? access.map((role: string) => ({ role }))
        : undefined;

    const [deletedAccessArsipKategori, updatedPrasaranaKategori] =
      await prisma.$transaction([
        prisma.accessArsipKategori.deleteMany({
          where: {
            arsipKategoriId: arsipKategori.id,
          },
        }),
        prisma.arsipKategori.update({
          where: {
            id,
          },
          data: {
            nama: body.nama ?? undefined,
            deskripsi: body.deskripsi ?? undefined,
            access: !accessMapper
              ? undefined
              : {
                  createMany: {
                    data: accessMapper,
                  },
                },
          },
        }),
      ]);

    return NextResponse.json(updatedPrasaranaKategori);
  } catch (error) {
    console.log("[ARSIP-PRASARANA_ID_PUT]", error);
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
    const arsipKategori = await prisma.arsipKategori.findUnique({
      where: {
        id,
      },
    });

    if (!arsipKategori)
      return new NextResponse("Arsip kategori tidak ditemukan", {
        status: 404,
      });

    const deletedPrasaranaKategori = await prisma.arsipKategori.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: `Arsip kategori dengan id:${deletedPrasaranaKategori.id} Sudah dihapus.`,
    });
  } catch (error) {
    console.log("[ARSIP-PRASARANA_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
