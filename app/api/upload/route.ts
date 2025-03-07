import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import {
  CONFIG_GOOGLE_CREDENTIALS,
  PARENT_FOLDER_ID,
} from "@/constants/google-drive";
import { checkIsAdmin, getCurrentUser } from "@/lib/server-utils";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (currentUser?.role === "USER") {
      return new NextResponse("Forbidden", { status: 403 });
    }
    // parse form data
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const prasaranaId = formData.get("prasaranaId") as string;
    const arsipKategoriId = formData.get("arsipKategoriId") as string;

    if (!prasaranaId || !arsipKategoriId) {
      return new NextResponse("prasaranaId & arsipKategoriId harus diisi", {
        status: 400,
      });
    }

    if (!files.length) {
      return new NextResponse("Tidak ada file Terupload", { status: 400 });
    }

    // Authenticate with Google Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: CONFIG_GOOGLE_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Check if exist or create folder based on prasaranaId
    const folderPrasaranaId = await findOrCreateFolder(
      drive,
      prasaranaId,
      PARENT_FOLDER_ID
    );

    // Check if exist or create folder based on arsipKategoriId
    const folderArsipKategoriId = await findOrCreateFolder(
      drive,
      arsipKategoriId,
      folderPrasaranaId
    );

    // Upload multiple files to the created folderArsipKategoriId folder
    const uploadedFiles = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      const fileResponse = await drive.files.create({
        requestBody: {
          name: file.name,
          parents: [folderArsipKategoriId], // Upload files inside the same folder
        },
        media: {
          mimeType: file.type,
          body: readableStream,
        },
        fields: "id, name, webViewLink",
      });

      uploadedFiles.push({
        fileId: fileResponse.data.id,
        fileName: fileResponse.data.name,
        fileLink: fileResponse.data.webViewLink,
      });
    }

    return NextResponse.json(
      { folderId: folderArsipKategoriId, uploadedFiles },
      { status: 200 }
    );
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
