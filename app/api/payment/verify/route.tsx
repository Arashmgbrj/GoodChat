import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const refId = url.searchParams.get("refid") || ""; // PayPing ارسال می‌کند
    const clientRefId = url.searchParams.get("clientrefid") || ""; // همان order_id
    const amount = Number(url.searchParams.get("amount") || 0);

    // ✅ آدرس دامنه سایت خودت
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://yoururl";

    if (!refId || !amount) {
      return NextResponse.redirect(`${BASE_URL}/payment/status/fail`);
    }

    // ✅ Verify پرداخت در PayPing
    const verify = await axios.post(
      "https://api.payping.ir/v2/pay/verify",
      { refId, amount },
      {
        headers: {
          Authorization: `Bearer your api`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ پرداخت موفق
    if (verify.status === 200) {
      const orderParts = clientRefId.split("-");
      const paymentBaseId = orderParts[1];

      const paymentRecord = await prisma.payment_Base.findUnique({
        where: { id: Number(paymentBaseId) },
        include: { user: true },
      });

      if (!paymentRecord || !paymentRecord.user) {
        return NextResponse.redirect(`${BASE_URL}/payment/status/fail`);
      }

      const user = paymentRecord.user;
      const plane = Number(paymentRecord.plane);

      // ثبت تراکنش در جدول payment_Finaly
      await prisma.payment_Finaly.create({
        data: {
          userId: user.id,
          plane: paymentRecord.plane,
          trans_id: refId,
          order_id: clientRefId,
          card_holder: verify.data?.cardNumber || "unknown",
          amount: paymentRecord.price,
          np_status: "OK",
        },
      });

      let count = 0;
      if (plane === 1) count = 100;
      else if (plane === 2) count = 200;
      else count = 300;

      const existingDataReq = await prisma.data_req.findFirst({
        where: { userId: user.id },
      });

      if (existingDataReq) {
        await prisma.data_req.update({
          where: { id: existingDataReq.id },
          data: { request_count: existingDataReq.request_count + count },
        });
      } else {
        await prisma.data_req.create({
          data: { userId: user.id, request_count: count },
        });
      }

      // بروزرسانی وضعیت پرداخت
      await prisma.payment_Base.update({
        where: { id: paymentRecord.id },
        data: { status: "ok" },
      });

      return NextResponse.redirect(`${BASE_URL}/payment/status/success`);
    } else {
      return NextResponse.redirect(`${BASE_URL}/payment/status/fail`);
    }
  } catch (error: any) {
    console.error("PayPing verify error:", error.response?.data || error.message);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "yourdomain";
    return NextResponse.redirect(`${BASE_URL}/payment/status/fail`);
  }
}
