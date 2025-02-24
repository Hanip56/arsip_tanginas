import prisma from "@/lib/db";
import { deleteDriveFolders } from "@/lib/google-drive";
import { checkIsAdmin } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

// delete multiple
export async function POST(req: NextRequest) {
  try {
    await checkIsAdmin();

    const body = await req.json();
    const { ids } = body;

    if (!ids || ids.length < 1) {
      return new NextResponse("No content", { status: 204 });
    }

    const deleteRes = await prisma.prasarana.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    const { success } = await deleteDriveFolders(ids);

    if (!success) {
      console.log("Failed to delete folders in google drive");
    }

    return NextResponse.json({ message: "Delete prasarana sucessfully." });
  } catch (error) {
    console.log("[PRASARANA_DELETE-MULTIPLE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
