import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const getCurrentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const checkIsAdmin = async () => {
  const user = await getCurrentUser();

  if (user?.role !== "ADMIN")
    return new NextResponse("Forbidden", { status: 403 });

  return user;
};
