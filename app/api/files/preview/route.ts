import { CONFIG_GOOGLE_CREDENTIALS } from "@/constants/google-drive";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const fileId = req.nextUrl.searchParams.get("fileId");

    if (!fileId) {
      return new NextResponse("fileId harus diisi", { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: CONFIG_GOOGLE_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    // get filename & mimetype
    const file = await drive.files.get({
      fileId,
      fields: "name, mimeType",
    });

    const mimeType = file.data.mimeType || "application/octet-stream";
    const actualFileName = file.data.name || "Downloaded-file";

    // get the actual file
    const response = await drive.files.get(
      {
        fileId,
        alt: "media",
      },
      { responseType: "stream" }
    );

    const headers = new Headers();
    headers.append(
      "Content-Disposition",
      `inline; filename="${actualFileName}"`
    );
    headers.append("Content-Type", mimeType);

    return new NextResponse(response.data as any, { status: 200, headers });
  } catch (error) {
    console.log("[PREVIEW_FILE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
