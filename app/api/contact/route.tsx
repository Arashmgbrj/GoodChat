import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// گرفتن IP کاربر
const IpExtracter = (req: NextRequest) => {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req as any).ip ||
    "0.0.0.0"
  );
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const formData = data["formData"];


    if (
      !formData?.name ||
      !formData?.email_form ||
      !formData?.subject ||
      !formData?.message
    ) {
      return NextResponse.json(
        { error: "تمام فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    const ip = IpExtracter(req);

    const contact = await prisma.contact.create({
      data: {
        name: formData.name,
        email: formData.email_form, 
        subject: formData.subject,
        comment: formData.message, 
        ip,
      },
    });

    return NextResponse.json(
      { success: true, message: "پیام شما با موفقیت ثبت شد" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
