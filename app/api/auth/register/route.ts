import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { checkIsAdmin } from "@/lib/server-utils";

export async function POST(req: Request) {
  try {
    const isAdmin = await checkIsAdmin();

    if (!isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const {
      // general
      username,
      email,
      password,
    } = await req.json();

    if (!username || !email || !password) {
      return new NextResponse(
        "Kolom yang dibutuhkan belum diisi; *username *email *password",
        { status: 400 }
      );
    }

    const userExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (userExist) {
      return new NextResponse("Email sudah digunakan", { status: 400 });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPass,
      },
    });

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
    console.log("[REGISTER_USER]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
