import { auth } from "@/auth";
import { ISADMIN } from "@/constants/role";
import { NextResponse } from "next/server";

export const getCurrentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const checkIsAdmin = async () => {
  const user = await getCurrentUser();
  let isAdmin = true;

  if (!ISADMIN(user?.role)) {
    isAdmin = false;
  }

  return isAdmin;
};

export const extractFileId = (webContentLink: string) => {
  const match = webContentLink.match(/id=([^&]+)/);
  return match ? match[1] : null;
};
