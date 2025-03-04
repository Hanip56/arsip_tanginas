import { UserRole } from "@prisma/client";

export const ISADMIN = (role: UserRole | undefined) =>
  role === "ADMIN" || role === "SUPERADMIN";
