import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { use } from "react";

const prisma = new PrismaClient();

// استخراج IP واقعی کاربر
const IpExtracter = (req: NextRequest) => {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req as any).ip ||
    "0.0.0.0"
  );
};

async function safeUpdate(email: string, data: any) {
  for (let i = 0; i < 3; i++) {
    try {
      return await prisma.user.update({ where: { email }, data });
    } catch (err: any) {
      console.log("Retrying due to DB lock...");
      await new Promise((res) => setTimeout(res, 300));
    }
  }
  throw new Error("Cannot update user after retries");
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, code, ip: ip_receive } = data;

    const code_re = `${code[3]}${code[2]}${code[1]}${code[0]}`



    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    console.log("User IPs before:", user.ip0, user.ip1, user.ip2);

    if (user.active_code !== code_re) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }
    const current_ip = IpExtracter(req);

    if(user.ip0 === ip_receive)
    {
       const updatedUser = await prisma.user.update({
         where: { token: user.token },
         data: { ip0: current_ip },
        });
        return NextResponse.json({ token: user.token}, { status: 200 });
      

      

    }
    else if(user.ip1 === ip_receive){
        const updatedUser = await prisma.user.update({
         where: { token: user.token },
         data: { ip1: current_ip },
        });
        return NextResponse.json({ token: user.token}, { status: 200 });


    }
    else{
        const updatedUser = await prisma.user.update({
         where: { token: user.token },
         data: { ip2: current_ip },
        });
        return NextResponse.json({ token: user.token}, { status: 200 });


    }

    
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
