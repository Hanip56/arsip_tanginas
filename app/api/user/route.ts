import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 1;
    const updatedAt = req.nextUrl.searchParams.get("updatedAt") || "desc";
    const search = req.nextUrl.searchParams.get("search") || "";

    let orderBy: Record<string, string> = {};

    if (typeof updatedAt === "string") {
      orderBy = {
        updatedAt,
      };
    }

    const where: Prisma.UserWhereInput = {
      username: { contains: search, mode: "insensitive" },
    };

    const total_items = await prisma.user.count({
      where,
    });

    const users = await prisma.user.findMany({
      where,
      take: limit,
      skip: limit * (page - 1),
      orderBy,
    });

    return NextResponse.json({
      data: users,
      total_items,
    });
  } catch (error) {
    console.log("[USER_GET]", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
