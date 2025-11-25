import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    
    const data = await req.json();
    const token = data.token;
    


    const existingUser = await prisma.user.findUnique({
      where: { token },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "user not found" }, { status: 405 });
    }

    const userId = existingUser.id;

    const request_status = await prisma.data_req.findFirst({
      where: { userId },
    });

    if (!request_status) {
      return NextResponse.json({ error: "request not found" }, { status: 200 });
    }

    if (request_status.request_count <= 0) {
      return NextResponse.json({ error: "ok" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "not" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "server error" }, { status: 400 });
  }
}
