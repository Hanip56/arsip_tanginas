import { NextRequest, NextResponse } from "next/server";
import { CONFIG_KEY_FILE_PATH } from "@/constants/google-drive";
import { google } from "googleapis";

export async function GET(req: NextRequest) {
  try {
    const folderName = req.nextUrl.searchParams.get("folderName");

    if (!folderName) {
      return new NextResponse("folderName is required", { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: CONFIG_KEY_FILE_PATH,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    const folder = await drive.files.list({
      q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id)",
    });

    if (!folder || folder.data.files?.length === 0) {
      return NextResponse.json({ files: [] }, { status: 200 });
    }

    const folderId = folder.data.files?.[0].id;

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields:
        "files(id, name, webViewLink, mimeType, hasThumbnail, thumbnailLink, webContentLink, size, createdTime, modifiedTime, originalFilename)",
    });

    return NextResponse.json({ files: response.data.files }, { status: 200 });
  } catch (error) {
    console.log("[FILES_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
