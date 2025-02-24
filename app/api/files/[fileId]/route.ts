import { CONFIG_GOOGLE_CREDENTIALS } from "@/constants/google-drive";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;

    const auth = new google.auth.GoogleAuth({
      credentials: CONFIG_GOOGLE_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    // get filename & mimetype
    const response = await drive.files.delete({ fileId });

    return NextResponse.json({
      success: true,
      message: "File deleted succesfully",
    });
  } catch (error) {
    console.log("[DELETE_FILE]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
