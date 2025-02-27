import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const id = (await params).id;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    let hashedPass: undefined | string = undefined;
    if (body?.password) {
      hashedPass = await bcrypt.hash(body?.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        username: body.username ?? undefined,
        email: body.email ?? undefined,
        role: body.role ?? undefined,
        password: hashedPass,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log("[USER_ID_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: `User with id:${deletedUser.id} has been deleted.`,
    });
  } catch (error) {
    console.log("[USER_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
