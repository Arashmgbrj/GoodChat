import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const token = data.token;
    const plane = Number(data.plane);

    const existingUser = await prisma.user.findUnique({
      where: { token },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    if (!plane) {
      return NextResponse.json({ error: "plane not found" }, { status: 400 });
    }

    const userId = existingUser.id;

    const requestStatus = await prisma.data_req.findFirst({
      where: { userId },
    });

    if (!requestStatus) {
      return NextResponse.json({ error: "request not found" }, { status: 404 });
    }

    if (requestStatus.request_count > 0) {
      return NextResponse.json(
        { error: "request already used" },
        { status: 409 }
      );
    }

    // تعیین قیمت بر اساس پلن
    let price = 0;
    if (plane === 1) price = 1000; // مبلغ کم برای تست
    else if (plane === 2) price = 2000;
    else if (plane === 3) price = 3000;
    else return NextResponse.json({ error: "invalid plane" }, { status: 400 });

    // ایجاد رکورد در Payment_Base
    const paymentBase = await prisma.payment_Base.create({
      data: {
        userId,
        plane: plane.toString(),
        price: price.toString(),
        status: "no",
      },
    });

    const callback_uri = `yourdomain/api/payment/verify`;
    const order_id = `ORD-${paymentBase.id}-${Date.now()}`;

    // بررسی اینکه آیا محیط تست است یا واقعی
    const isTest = true; // برای تست، بعداً می‌توانید از env استفاده کنید
    const payerName = isTest ? "Test User" : existingUser.email;

    const response = await axios.post(
      "https://api.payping.ir/v2/pay",
      {
        amount: price,
        payerName,
        description: `خرید پلن ${plane}`,
        clientRefId: order_id,
        returnUrl: callback_uri, // حتماً URL مطلق باشد
        custom: token,
      },
      {
        headers: {
          Authorization: `Bearer your api`,
          "Content-Type": "application/json",
        },
      }
    );

    const paypingCode = response.data.code;
    if (!paypingCode) {
      return NextResponse.json(
        { error: "failed to create PayPing transaction" },
        { status: 500 }
      );
    }

    const payment_url = `https://api.payping.ir/v2/pay/gotoipg/${paypingCode}`;

    return NextResponse.json({
      payment_url,
      order_id,
      code: paypingCode,
      amount: price,
    });
  } catch (error: any) {
    console.error("PayPing error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "server error" },
      { status: 500 }
    );
  }
}
