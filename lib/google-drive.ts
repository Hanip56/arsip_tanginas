import { CONFIG_KEY_FILE_PATH } from "@/constants/google-drive";
import { google } from "googleapis";

// 🔹 Load Google Drive API client
const auth = new google.auth.GoogleAuth({
  keyFile: CONFIG_KEY_FILE_PATH,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export const deleteDriveFolders = async (folderNames: string[]) => {
  try {
    for (const folderName of folderNames) {
      const folder = await drive.files.list({
        q: `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id)",
      });

      if (folder.data.files && folder.data.files?.length > 0) {
        const res = await drive.files.update({
          fileId: folder.data.files[0].id!,
          requestBody: { trashed: true },
        });
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

// 🔹 Fetch subfolders & count items
export const getSubfolderItemCounts = async (parentFolderName: string) => {
  try {
    // get parentFolderId
    const folder = await drive.files.list({
      q: `name = '${parentFolderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id)",
    });

    if (!folder || folder.data.files?.length === 0) {
      throw new Error("Folder not found");
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

    return folderData;
  } catch (error) {
    console.error("Error fetching subfolder counts:", error);
    return {};
  }
};
