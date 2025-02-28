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

type GetInfoResponse = {
  totalFiles: number;
  storage: {
    used: number | undefined;
    limit: number | undefined;
    driveUsed: number | undefined;
    trash: number | undefined;
  };
};

export const GetInfo = async () => {
  try {
    const response = await axiosInstance.get<GetInfoResponse>(
      "/files/information"
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

type GetLatestFilesParams = {
  pageToken?: string;
  limit?: number;
  nama?: string;
  createdTime?: "asc" | "desc";
};

type GetLatestFilesResponse = {
  files: {
    id: string;
    name: string;
    mimeType: string;
    createdTime: string;
    size: string;
    thumbnailLink: string;
    parents: string[];
    arsipKategori: string;
    prasarana: string;
    arsipKategoriId: string;
    prasaranaId: string;
  }[];
  nextPageToken: string | null;
  pageToken: string | null | undefined;
};

export const GetLatestFiles = async ({
  pageToken,
  limit,
  nama,
  createdTime,
}: GetLatestFilesParams) => {
  try {
    const response = await axiosInstance.get<GetLatestFilesResponse>(
      `/files/latest?pageToken=${pageToken ?? ""}&limit=${limit ?? ""}&nama=${
        nama ?? ""
      }&createdTime=${createdTime ?? ""}`
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
