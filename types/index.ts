import { Prasarana, PrasaranaKategori, User } from "@prisma/client";

export type PrasaranaWithUserAndKategori = Prasarana & {
  user: User;
  kategori: PrasaranaKategori;
};
