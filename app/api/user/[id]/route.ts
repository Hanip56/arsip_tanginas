import { auth } from "@/auth";
import prisma from "@/lib/db";
import { checkIsAdmin } from "@/lib/server-utils";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    const body = await req.json();
    const id = (await params).id;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return new NextResponse("User tidak ditemukan", { status: 404 });

    // role ADMIN cannot update SUPERADMIN
    // role USER cannot update other user
    if (session?.user.role === "ADMIN" && user.role === "SUPERADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (session?.user.id === "USER" && session.user.id !== user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

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
        role: session?.user.role === "SUPERADMIN" ? body.role : undefined,
        password: hashedPass,
      },
    });

    return NextResponse.json({ ...updatedUser, password: undefined });
  } catch (error) {
    console.log("[USER_ID_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const id = (await params).id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return new NextResponse("User tidak ditemukan", { status: 404 });

    // role ADMIN cannot delete SUPERADMIN
    // role USER cannot delete other user
    if (session?.user.role === "ADMIN" && user.role === "SUPERADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: `User dengan id:${deletedUser.id} Sudah dihapus.`,
    });
  } catch (error) {
    console.log("[USER_ID_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
