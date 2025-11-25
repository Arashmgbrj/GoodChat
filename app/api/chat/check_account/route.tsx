import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const token = data.token;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { token } });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = existingUser.id;

    const checkLic = await prisma.data_req.findFirst({
      where: { userId },
    });

    if (!checkLic || checkLic.request_count === 0) {
      return NextResponse.json(
        {
          message: "Checked user request",
          count: checkLic?.request_count || 0,
          username: existingUser.email,
        },
        { status: 203 }
      );
    }

    return NextResponse.json({
      message: "Checked user request",
      count: checkLic.request_count,
      username: existingUser.email,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
