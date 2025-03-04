import {
  AccessArsipKategori,
  ArsipKategori,
  Prasarana,
  PrasaranaKategori,
  User,
} from "@prisma/client";

export type PrasaranaWithUserAndKategori = Prasarana & {
  user: User;
  kategori: PrasaranaKategori;
};

export type ArsipKategoriWithAccess = ArsipKategori & {
  access: AccessArsipKategori[];
};
