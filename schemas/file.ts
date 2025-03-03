import { z } from "zod";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 mb
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const ImageType = z
  .any()
  .refine(
    (file) => !(file instanceof File) || file.size <= MAX_FILE_SIZE,
    "Maksimal ukuran file adalah 5mb"
  )
  .refine(
    (file) =>
      !(file instanceof File) || ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png, and .webp format yang didukung."
  );
