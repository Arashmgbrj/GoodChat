import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// استخراج IP کاربر
const IpExtracter = (req: NextRequest) => {
  // بررسی x-forwarded-for (برای پراکسی‌ها یا Vercel)
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  // بررسی socket.remoteAddress (در محیط Node.js)
  // @ts-ignore
  if (req.socket?.remoteAddress) {
    // @ts-ignore
    return req.socket.remoteAddress;
  }

  // پیش‌فرض
  return "0.0.0.0";
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const token = data.token;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { token },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentIp = IpExtracter(req);
    const allowedIps = [user.ip0, user.ip1, user.ip2];

    if (allowedIps.includes(currentIp)) {
      return NextResponse.json({
        message: "Token valid, IP allowed",
        user: {
          id: user.id,
          email: user.email,
          ip0: user.ip0,
          ip1: user.ip1,
          ip2: user.ip2,
        },
      });
    }

    const emptyIndex = allowedIps.findIndex(ip => ip === "0.0.0.0");
    if (emptyIndex !== -1) {
      const updatedData: any = {};
      updatedData[`ip${emptyIndex}`] = currentIp;

      const updatedUser = await prisma.user.update({
        where: { token },
        data: updatedData,
      });

      return NextResponse.json({
        message: "Token valid, new IP added",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          ip0: updatedUser.ip0,
          ip1: updatedUser.ip1,
          ip2: updatedUser.ip2,
        },
      });
    }

    return NextResponse.json(
      {
        error: "IP limit exceeded",
        currentIp,
        ip0: user.ip0,
        ip1: user.ip1,
        ip2: user.ip2,
      },
      { status: 403 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
