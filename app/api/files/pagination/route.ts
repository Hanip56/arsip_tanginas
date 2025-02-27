import { getLatestUploadedFile } from "@/lib/google-drive";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const pageToken = req.nextUrl.searchParams.get("pageToken");
    const limit = req.nextUrl.searchParams.get("limit")
      ? Number(req.nextUrl.searchParams.get("limit"))
      : undefined;

    const latestUploadedFiles = await getLatestUploadedFile({
      pageToken,
      limit,
    });

    return NextResponse.json(latestUploadedFiles);
  } catch (error) {
    console.log("[PAGINATION-FILES_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
