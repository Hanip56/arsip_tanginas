import { CONFIG_KEY_FILE_PATH } from "@/constants/google-drive";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const folderName = req.nextUrl.searchParams.get("folderName");

    if (!folderName) {
      return new NextResponse("folderName is required", { status: 404 });
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: CONFIG_KEY_FILE_PATH,
      scopes: ["https://www.googleapis.com/auth/drive.metadata.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    const folder = await drive.files.list({
      q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id)",
    });

    if (!folder || folder.data.files?.length === 0) {
      return new NextResponse("Folder not found", { status: 404 });
    }

    const parentFolderId = folder.data.files?.[0].id;

    // 1️⃣ Get all subfolders inside the parent folder
    const subfolders = await drive.files.list({
      q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id, name)",
    });

    const folderData: Record<string, number> = {};

    // 2️⃣ Count items in each subfolder
    for (const folder of subfolders.data.files || []) {
      const fileCount = await drive.files.list({
        q: `'${folder.id}' in parents and trashed=false`,
        fields: "files(id)",
      });

      folderData[folder.name!] = fileCount.data.files?.length || 0;
    }

    return NextResponse.json(folderData);
  } catch (error) {
    console.log("[FILES_SUBFOLDER-COUNT_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
