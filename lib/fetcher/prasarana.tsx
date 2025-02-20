import { axiosInstance } from "../axios";
import axios from "axios";
import { DEFAULT_LIMIT_REQUEST } from "../settings";
import { Prasarana } from "@prisma/client";
import { PrasaranaWithUserAndKategori } from "@/types";

type GetAllParams = {
  page?: number;
  limit?: number;
  kategoriId: string;
  search?: string;
  updatedAt?: string;
};

type GetAllResponse = {
  page: number;
  limit: number;
  total_items: number;
  data: PrasaranaWithUserAndKategori[];
};

export const getAll = async ({
  page = 1,
  limit = DEFAULT_LIMIT_REQUEST,
  search,
  updatedAt,
  kategoriId,
}: GetAllParams) => {
  try {
    const response = await axiosInstance.get<GetAllResponse>("/prasarana", {
      params: {
        page,
        limit,
        search,
        updatedAt,
        kategoriId,
      },
    });

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
  data: Partial<Prasarana>;
};

export const update = async ({ id, data }: UpdateParams) => {
  try {
    const response = await axiosInstance.put(`/prasarana/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};

type DeleteMultipleParams = {
  ids: string[];
};

export const deleteMultiple = async ({ ids }: DeleteMultipleParams) => {
  try {
    const response = await axiosInstance.post(`/prasarana/delete-multiple`, {
      ids,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Axios error: ${error.message}`);
    } else {
      throw new Error(`Unexpected error: ${error}`);
    }
  }
};
