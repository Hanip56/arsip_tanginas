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
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Export the file as a PDF
    const pdfResponse = await drive.files.export(
      { fileId, mimeType: "application/pdf" },
      { responseType: "stream" }
    );

    return new NextResponse(pdfResponse.data as any, {
      status: 200,
      headers: { "Content-Type": "application/pdf" },
    });
  } catch (error) {
    console.log("[PREVIEW-DOC_FILE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
