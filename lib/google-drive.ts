import { arsipKategori } from "@/constants/arsip";
import {
  CONFIG_GOOGLE_CREDENTIALS,
  PARENT_FOLDER_ID,
} from "@/constants/google-drive";
import { drive_v3, google } from "googleapis";
import prisma from "./db";
import { Readable } from "stream";

// 🔹 Load Google Drive API client
const auth = new google.auth.GoogleAuth({
  credentials: CONFIG_GOOGLE_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

export const drive = google.drive({ version: "v3", auth });

export const uploadFile = async (file: File, parent: string) => {
  try {
    const arrayBuffer = await file?.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    const resDrive = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: [parent],
      },
      media: {
        mimeType: file.type,
        body: readableStream,
      },
      fields: "id, name, webContentLink",
    });

    return {
      id: resDrive.data.id,
      name: resDrive.data.name,
      webContentLink: resDrive.data.webContentLink,
    };
  } catch (error) {
    console.error(`Failed to upload file: ${error}`);
    return {};
  }
};

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

export const countTotalFilesInFolder = async (
  folderId: string
): Promise<number> => {
  let totalCount = 0;
  let nextPageToken: string | undefined;

  do {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, mimeType), nextPageToken",
      pageToken: nextPageToken,
    });

    if (!response.data.files) return totalCount;

    for (const file of response.data.files) {
      if (file.mimeType === "application/vnd.google-apps.folder") {
        // If it's a folder, count its contents recursively
        if (file.id) {
          totalCount += await countTotalFilesInFolder(file.id);
        }
      } else {
        totalCount += 1; // Count files
      }
    }

    nextPageToken = response.data.nextPageToken ?? undefined;
  } while (nextPageToken);

  return totalCount;
};

export const getDriveStorageInfo = async () => {
  try {
    const response = await drive.about.get({
      fields: "storageQuota",
    });

    const storageQuota = response.data.storageQuota;
    return {
      used: parseInt(storageQuota?.usage || "0", 10), // Total used space
      limit: parseInt(storageQuota?.limit || "0", 10), // Total drive storage limit
      driveUsed: parseInt(storageQuota?.usageInDrive || "0", 10), // Used in Drive
      trash: parseInt(storageQuota?.usageInDriveTrash || "0", 10), // Used in Trash
    };
  } catch (error) {
    console.error("Error fetching storage info:", error);
    throw new Error("Failed to get storage info");
  }
};

/**
 * Fetch the latest uploaded file in Google Drive
 */
// export const getLatestUploadedFile = async () => {
//   try {
//     const arsipKategoris = await prisma.arsipKategori.findMany();

//     const response = await drive.files.list({
//       q: "'me' in owners and mimeType != 'application/vnd.google-apps.folder'", // Only files owned by you
//       orderBy: "createdTime desc", // Sort by latest created
//       fields:
//         "files(id, name, mimeType, createdTime, size, thumbnailLink, parents)",
//       pageSize: 5, // Get only the latest file
//     });

//     const filesTemp = response.data?.files ?? [];
//     const filesResult = [];

//     for (const file of filesTemp) {
//       const parentFolder = await drive.files.get({
//         fileId: file.parents?.[0] ?? "",
//         fields: "id, parents, name",
//       });

//       const grandParentFolder = await drive.files.get({
//         fileId: parentFolder.data.parents?.[0] ?? "",
//         fields: "id, name",
//       });

//       const prasarana = await prisma.prasarana.findUnique({
//         where: { id: grandParentFolder.data.name ?? "" },
//       });

//       filesResult.push({
//         ...file,
//         arsipKategori:
//           arsipKategoris.find((ak) => ak.id == parentFolder.data.name)?.nama ??
//           "",
//         prasarana: prasarana?.nama,
//       });
//     }

//     return filesResult;
//   } catch (error) {
//     console.error("Error fetching latest uploaded file:", error);
//     throw new Error("Failed to fetch the latest file");
//   }
// };

/**
 * Fetch the latest uploaded file in Google Drive (Optimized)
 */
type GetLatestUploadedFileParams = {
  pageToken: string | null | undefined;
  limit?: number;
  nama?: string;
  createdTime?: "asc" | "desc";
};

export const getLatestUploadedFile = async ({
  pageToken = undefined,
  limit = 5,
  nama,
  createdTime,
}: GetLatestUploadedFileParams) => {
  try {
    // Fetch all archive categories once
    const arsipKategoris = await prisma.arsipKategori.findMany();

    const { parent, grandParent, prasaranaIds } =
      await GetParentAndGrandParentFolder();

    const filterNama = nama ? ` and name contains '${nama}'` : "";
    const orderBy = createdTime ? createdTime : "desc";

    // Fetch the latest files from Google Drive
    let filesTemp: drive_v3.Schema$File[] = [];
    let nextPageToken: string | null = null;

    if (parent.ids.length > 0) {
      const response = await drive.files.list({
        q: `(${parent.ids
          .map((id) => `'${id}' in parents`)
          .join(
            " or "
          )}) and mimeType != 'application/vnd.google-apps.folder'${filterNama} and trashed=false`, // Only files related to parentFolder (arsipKategori)
        orderBy: `createdTime ${orderBy}`, // Sort by latest created
        fields:
          "nextPageToken, files(id, name, mimeType, createdTime, size, thumbnailLink, parents)",
        pageSize: limit, // Get only the latest files
        pageToken: pageToken || undefined,
      });

      filesTemp = response.data?.files ?? [];
      nextPageToken = response.data?.nextPageToken ?? null;
    }

    // Fetch all required prasarana records in one query
    const prasaranaRecords = await prisma.prasarana.findMany({
      where: { id: { in: prasaranaIds as string[] } },
      select: { id: true, nama: true },
    });

    // Map prasarana ID to its name for quick lookup
    const prasaranaMapNames = new Map(
      prasaranaRecords.map((p) => [p.id, p.nama])
    );
    const prasaranaMapIds = new Map(prasaranaRecords.map((p) => [p.id, p.id]));

    // Process files with mapped data
    const filesResult = filesTemp.map((file) => {
      const parentFolderTemp = parent.map.get(file.parents?.[0]);
      const grandParentFolder = grandParent.map.get(
        parentFolderTemp?.parents?.[0]
      );
      const arsipKategori = arsipKategoris.find(
        (ak) => ak.id === parentFolderTemp?.name
      );

      return {
        ...file,
        arsipKategori: arsipKategori?.nama || "",
        prasarana: prasaranaMapNames.get(grandParentFolder?.name ?? "") || "",
        arsipKategoriId: arsipKategori?.id || "",
        prasaranaId: prasaranaMapIds.get(grandParentFolder?.name ?? "") || "",
      };
    });

    return {
      pageToken,
      files: filesResult,
      nextPageToken,
    };
  } catch (error) {
    console.error("Error fetching latest uploaded file:", error);
    throw new Error("Failed to fetch the latest file");
  }
};

export const GetParentAndGrandParentFolder = async () => {
  try {
    // Fetch prasarana folder
    const grandParentFoldersQuery = await drive.files.list({
      q: `'${PARENT_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id, name)",
    });

    const grandParentFolders = grandParentFoldersQuery.data.files;

    // Extract unique grandparent folder IDs
    const grandParentFolderIds = [
      ...new Set(grandParentFolders?.map((gpf) => gpf.id).filter(Boolean)),
    ];

    // Extract prasarana IDs
    const prasaranaIds = [
      ...new Set(grandParentFolders?.map((gpf) => gpf.name).filter(Boolean)),
    ];

    let parentFolders: drive_v3.Schema$File[] | undefined = [];

    if (grandParentFolderIds.length > 0) {
      const parentFoldersQuery = await drive.files.list({
        q: `(${grandParentFolderIds
          .map((id) => `'${id}' in parents`)
          .join(
            " or "
          )}) and mimeType = 'application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id, name, parents)",
      });

      parentFolders = parentFoldersQuery.data.files;
    }

    // Extract unique parent folder IDs (to minimize API calls)
    const parentFolderIds = [
      ...new Set(parentFolders?.map((pf) => pf.id).filter(Boolean)),
    ];

    // Map parent folder ID to its data for quick lookup
    const parentFolderMap = new Map(parentFolders?.map((res) => [res.id, res]));

    // Map grandparent folder ID to its data for quick lookup
    const grandParentFolderMap = new Map(
      grandParentFolders?.map((res) => [res.id, res])
    );

    return {
      parent: {
        map: parentFolderMap,
        ids: parentFolderIds,
      },
      grandParent: {
        map: grandParentFolderMap,
        ids: grandParentFolderIds,
      },
      prasaranaIds,
    };
  } catch (error) {
    console.error(
      "Error get parent and grandparent folder information:",
      error
    );
    throw new Error("Failed to fetch the latest file");
  }
};
