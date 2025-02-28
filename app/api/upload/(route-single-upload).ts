import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { Readable } from "stream";
import { PARENT_FOLDER_ID } from "@/constants/google-drive";

// Load Google Service Account credentials
const KEY_FILE_PATH = path.join(process.cwd(), "config/service-account.json");

export async function POST(req: NextRequest) {
  try {
    // parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("Tidak ada file uploaded", { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert buffer to a readable stream
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // End the stream

    // Authenticate with Google Service Account
    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_FILE_PATH,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    // 1️⃣ **Check if the folder already exists (optional)**
    const folderId = await findOrCreateFolder(
      drive,
      "Rumah Sakit",
      PARENT_FOLDER_ID
    );

    // 1️⃣ **Check subFolder already exists (optional)**
    const subfolderId = await findOrCreateFolder(drive, "Photo 30%", folderId);

    const response = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [subfolderId],
      },
      media: {
        mimeType: file.type,
        body: readableStream,
      },
      fields: "id",
    });

    return NextResponse.json({ fileId: response.data.id }, { status: 200 });
  } catch (error) {
    console.log("[UPLOAD_FILE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}

/**
 * Function to find or create a folder in Google Drive.
 * If a folder with the given name exists, return its ID.
 * Otherwise, create a new one.
 */
async function findOrCreateFolder(
  drive: any,
  folderName: string,
  parentFolderId?: string
) {
  try {
    // Search for an existing folder with the same name
    const query = `'${
      parentFolderId || "root"
    }' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
    const response = await drive.files.list({ q: query, fields: "files(id)" });

    if (response.data.files.length > 0) {
      return response.data.files[0].id; // Return existing folder ID
    }

    // Folder not found, create a new one
    const folderResponse = await drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: parentFolderId ? [parentFolderId] : [], // Set parent if provided
      },
      fields: "id",
    });

    return folderResponse.data.id; // Return new folder ID
  } catch (error) {
    console.error("Folder creation error:", error);
    throw new Error("Failed to create folder");
  }
}
