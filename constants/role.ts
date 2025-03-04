import { UserRole } from "@prisma/client";

export const ISADMIN = (role: UserRole | undefined) =>
  role === "ADMIN" || role === "SUPERADMIN";

export const roles = ["USER", "LAPANGAN", "KONSULTAN"];
