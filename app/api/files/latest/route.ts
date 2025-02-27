import { getLatestUploadedFile } from "@/lib/google-drive";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const pageToken = req.nextUrl.searchParams.get("pageToken") || undefined;
    const nama = req.nextUrl.searchParams.get("nama") || "";
    const createdTime =
      (req.nextUrl.searchParams.get("createdTime") as "asc" | "desc") ||
      undefined;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 5;

    const data = await getLatestUploadedFile({
      pageToken,
      limit,
      nama,
      createdTime,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log("[LATEST-FILES_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
