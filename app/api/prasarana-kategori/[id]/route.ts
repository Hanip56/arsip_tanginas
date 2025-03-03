import { KATEGORI_THUMBNAIL_FOLDER_ID } from "@/constants/google-drive";
import prisma from "@/lib/db";
import { drive, uploadFile } from "@/lib/google-drive";
import { checkIsAdmin, extractFileId } from "@/lib/server-utils";
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
    const id = (await params).id;

    const prasaranaKategori = await prisma.prasaranaKategori.findUnique({
      where: {
        id,
      },
    });

    const formData = await req.formData();
    const nama = formData.get("nama") as string;
    const deskripsi = formData.get("deskripsi") as string | undefined;
    const image = formData.get("image") as File | undefined;

    if (!prasaranaKategori)
      return new NextResponse("Prasarana kategori tidak ditemukan", {
        status: 404,
      });

    let newImageUrl: string | null | undefined = undefined;
    if (image) {
      const { webContentLink } = await uploadFile(
        image,
        KATEGORI_THUMBNAIL_FOLDER_ID
      );

      newImageUrl = webContentLink;

      // delete old image
      const oldFileId = extractFileId(prasaranaKategori.imageUrl ?? "");
      if (oldFileId) {
        await drive.files.delete({
          fileId: oldFileId,
        });
      }
    }

    const updatedPrasaranaKategori = await prisma.prasaranaKategori.update({
      where: {
        id,
      },
      data: {
        nama: nama ?? undefined,
        deskripsi: deskripsi ?? undefined,
        imageUrl: newImageUrl ?? undefined,
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
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const id = (await params).id;

  try {
    const prasaranaKategori = await prisma.prasaranaKategori.findUnique({
      where: {
        id,
      },
    });

    if (!prasaranaKategori)
      return new NextResponse("Prasarana kategori tidak ditemukan", {
        status: 404,
      });

    const deletedPrasaranaKategori = await prisma.prasaranaKategori.delete({
      where: {
        id,
      },
    });

    if (prasaranaKategori.imageUrl) {
      // delete old image
      const oldFileId = extractFileId(prasaranaKategori.imageUrl ?? "");
      if (oldFileId) {
        await drive.files.delete({
          fileId: oldFileId,
        });
      }
    }

    return NextResponse.json({
      message: `Prasarana kategori dengan id:${deletedPrasaranaKategori.id} Sudah dihapus.`,
    });
  } catch (error) {
    console.log("[PRASARANA-KATEGORI_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
