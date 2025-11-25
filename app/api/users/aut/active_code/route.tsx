import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

const IpExtracter = (req: NextRequest) => {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "0.0.0.0";
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const email = data.email;
    const code = data.code;

    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const reversed = code.split("").reverse().join("");
    if (existingUser.active_code !== reversed) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

    const current_ip = IpExtracter(req);
    const ips = [existingUser.ip0, existingUser.ip1, existingUser.ip2];
    const empty_ip = ips.map(ip => ip === "0.0.0.0");

    if (!empty_ip[0] && !empty_ip[1] && !empty_ip[2] && !ips.includes(current_ip)) {
      return NextResponse.json({ ips }, { status: 402 });
    }

    const new_code = getRandomInt(1000, 9999).toString();
    let updatedUser = existingUser;

    for (let i = 0; i < 3; i++) {
      if (ips[i] === current_ip || empty_ip[i]) {
        const updateData: any = { active_code: new_code };
        if (ips[i] !== current_ip) updateData[`ip${i}`] = current_ip;

        updatedUser = await prisma.user.update({
          where: { email },
          data: updateData,
        });
        break;
      }
    }

    return NextResponse.json({ token: updatedUser.token }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
