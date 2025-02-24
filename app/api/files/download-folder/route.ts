import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import { PassThrough, Stream } from "stream";
import { CONFIG_GOOGLE_CREDENTIALS } from "@/constants/google-drive";

export async function GET(req: NextRequest) {
  try {
    const folderName = req.nextUrl.searchParams.get("folderName");

    if (!folderName) {
      return new NextResponse("folderName is required", { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: CONFIG_GOOGLE_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    const folder = await drive.files.list({
      q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id)",
    });

    if (!folder || folder.data.files?.length === 0) {
      return new NextResponse("Folder not found", { status: 404 });
    }

    const folderId = folder.data.files?.[0].id;

    // get all files in the folder
    const fileList = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType)",
    });

    const files = fileList.data.files || [];

    if (files.length === 0) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Create a ZIP archive and a stream
    const zipStream = new PassThrough();
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(zipStream);

    // If client abort download
    req.signal.addEventListener("abort", () => {
      console.log("Client aborted download.");
      zipStream.destroy();
    });

    // Stream each file into the archive
    for (const file of files) {
      const fileStream = await drive.files.get(
        { fileId: file.id!, alt: "media" },
        { responseType: "stream" }
      );

      archive.append(fileStream.data, { name: file.name! });
    }

    // Finalize the archive
    archive.finalize();

    // Set proper response headers
    const headers = new Headers();
    headers.append("Content-Disposition", `attachment; filename="folder.zip"`);
    headers.append("Content-Type", "application/zip");

    return new NextResponse(zipStream as any, { status: 200, headers });
  } catch (error) {
    console.log("[FILES_DOWNLOAD-FOLDER_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
