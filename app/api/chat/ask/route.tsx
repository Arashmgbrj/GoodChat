import OpenAI from "openai";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Blob } from "fetch-blob"; // named import
import { File } from "fetch-blob/file.js"; // named import

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: "yorapi",
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const message = formData.get("message")?.toString() || "";
    const token = formData.get("token")?.toString() || "";

    const existingUser = await prisma.user.findUnique({ where: { token } });


    if (!existingUser)
      return NextResponse.json({ error: "user not found" }, { status: 404 });

    const userId = existingUser.id;
    const request_status = await prisma.data_req.findFirst({ where: { userId } });
    if (!request_status || request_status.request_count <= 0)
      return NextResponse.json({ error: "no requests left" }, { status: 404 });

    await prisma.data_req.update({
      where: { id: request_status.id },
      data: { request_count: request_status.request_count - 1 },
    });

    const files = formData.getAll("file");
    const userInputs: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const mimeType = file.type || "";
      const arrayBuffer = await file.arrayBuffer();
      const fileForOpenAI = new File([arrayBuffer], file.name, { type: mimeType });

      if (mimeType.startsWith("audio/")) {
        const transcription = await openai.audio.transcriptions.create({
          file: fileForOpenAI,
          model: "whisper-1",
        });
        userInputs.push(
          `🎙 متن استخراج‌شده از صوت (${file.name}): ${transcription.text}`
        );
      } else if (mimeType.startsWith("image/")) {
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "شما یک دستیار هوشمند هستید." },
            {
              role: "user",
              content: [
                { type: "text", text: message || "این تصویر رو توضیح بده" },
                { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
              ],
            },
          ],
        });
        userInputs.push(
          `🖼 توضیح تصویر (${file.name}): ${completion.choices[0].message.content}`
        );
      } else if (mimeType === "text/plain" || file.name.endsWith(".txt")) {
        const textContent = Buffer.from(arrayBuffer).toString("utf-8");
        userInputs.push(`📄 محتوای فایل متنی (${file.name}): ${textContent}`);
      } else {
        userInputs.push(`📎 فایل ${file.name} دریافت شد (نوع: ${mimeType})`);
      }
    }

    const stream = await openai.chat.completions.stream({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "شما یک دستیار هوشمند هستید." },
        { role: "user", content: message },
        { role: "user", content: userInputs.join("\n") },
        
      ],
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: "خطا در پردازش درخواست" }, { status: 500 });
  }
}
