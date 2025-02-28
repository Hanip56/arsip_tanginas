import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse(
        "Kolom yang dibutuhkan belum diisi; *email *password",
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return new NextResponse("User tidak ditemukan", { status: 404 });
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      return new NextResponse("Credentials tidak valid", { status: 401 });
    }

    // @ts-expect-error :expiresIn must be StringValue
    const token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE!,
    });

    return NextResponse.json({
      ...user,
      token,
      password: undefined,
      hidden: undefined,
    });
  } catch (error) {
    console.log("[LOGIN_USER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
