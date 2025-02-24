import { axiosInstance } from "../axios";
import axios from "axios";
import { PrasaranaKategori } from "@prisma/client";
import { DriveFile } from "@/types/drive";

type GetByFolderNameParams = {
  folderName: string;
  parentFolderName: string;
};

type GetByFolderNameResponse = {
  files: DriveFile[];
};

export const getByFolderName = async ({
  folderName,
  parentFolderName,
}: GetByFolderNameParams) => {
  try {
    const response = await axiosInstance.get<GetByFolderNameResponse>(
      "/files",
      {
        params: {
          folderName,
          parentFolderName,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export const deleteFileById = async ({ fileId }: { fileId: string }) => {
  try {
    const response = await axiosInstance.delete(`/files/${fileId}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
