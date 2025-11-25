import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
// @ts-ignore
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// ارسال ایمیل
const send_mail = async (to: string, code: string): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      host: "mail.good-chat-ai.ir",
      port: 465,
      secure: true,
      auth: {
        user: "goodchataut@good-chat-ai.ir",
        pass: "Alpha13821382@",
      },
    });

    const text = `
🎉 سلام و درود بر شما کاربر عزیز 🌹

از اینکه از سرویس ما استفاده می‌کنید بسیار خرسندیم 💫  
برای ادامه فرایند ثبت‌نام یا ورود، لطفاً کد تایید زیر را وارد کنید 👇

🔹 کد تایید شما:
${code}

در صورت عدم درخواست این کد، لطفاً این پیام را نادیده بگیرید.
با احترام ❤️
تیم پشتیبانی GoodChat
`;

    const subject = "Good Chat Authentication";

    await transporter.sendMail({
      from: "info@goodchat.ir",
      to,
      subject,
      text,
    });

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

const IpExtracter = (req: NextRequest) => {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";
};

function generateToken() {
  return randomBytes(16).toString("hex");
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function safeUpdate(email: string, data: any) {
  for (let i = 0; i < 3; i++) {
    try {
      return await prisma.user.update({ where: { email }, data });
    } catch {
      console.log("Retrying due to DB lock...");
      await new Promise((res) => setTimeout(res, 300));
    }
  }
  throw new Error("Cannot update user after retries");
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const email = data.email;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      const code = getRandomInt(1000, 9999);
      const updatedUser = await safeUpdate(email, {
        token: generateToken(),
        active_code: code.toString(),
      });

      send_mail(email, code.toString()).catch(console.error);

      return NextResponse.json(
        { status: "ok", code_data: code.toString() },
        { status: 200 }
      );
    }

    // کاربر جدید
    const random_code = getRandomInt(1000, 9999).toString();
    const ip = IpExtracter(req);

    const user = await prisma.user.create({
      data: {
        email,
        active_code: random_code,
        token: generateToken(),
        ip0: ip,
        ip1: "0.0.0.0",
        ip2: "0.0.0.0",
        lastLogin: null,
      },
    });
    send_mail(email, random_code).catch(console.error);

    return NextResponse.json({
      message: "User created successfully",
      user: { status: "ok", code: random_code },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot create user" }, { status: 500 });
  }
}
