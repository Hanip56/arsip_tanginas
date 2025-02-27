import {
  countTotalFilesInFolder,
  getDriveStorageInfo,
} from "@/lib/google-drive";
import { NextRequest, NextResponse } from "next/server";
import { PARENT_FOLDER_ID } from "@/constants/google-drive";

export async function GET(req: NextRequest) {
  try {
    const storage = await getDriveStorageInfo();

    const totalFiles = await countTotalFilesInFolder(PARENT_FOLDER_ID);

    return NextResponse.json({ totalFiles, storage });
  } catch (error) {
    console.log("[INFORMATION-FILES_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
