import { axiosInstance } from "../axios";
import axios from "axios";
import { DEFAULT_LIMIT_REQUEST } from "../settings";
import { ArsipKategori, PrasaranaKategori } from "@prisma/client";
import { ArsipKategoriWithAccess } from "@/types";

type GetAllParams = {
  page?: number;
  limit?: number;
  search?: string;
  updatedAt?: string;
};

type GetAllResponse = {
  page: number;
  limit: number;
  total_items: number;
  data: ArsipKategoriWithAccess[];
};

export const getAll = async ({
  page,
  limit = DEFAULT_LIMIT_REQUEST,
  search,
  updatedAt,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>(
      "/arsip-kategori",
      {
        params: {
          page,
          limit,
          search,
          updatedAt,
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

type UpdateParams = {
  id: string;
  data: Partial<ArsipKategori & { access?: string[] }>;
};

export const update = async ({ id, data }: UpdateParams) => {
  try {
    const response = await axiosInstance.put(`/arsip-kategori/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

export const deleteOne = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/arsip-kategori/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
