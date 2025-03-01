import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const getCurrentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const checkIsAdmin = async () => {
  const user = await getCurrentUser();
  let isAdmin = true;

  if (user?.role == "USER") {
    isAdmin = false;
  }

  return isAdmin;
};
