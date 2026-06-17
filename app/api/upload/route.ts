import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

const allowedCategories = new Set(["hotel", "vehicle", "booking"]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const categoryValue = formData.get("category");
    const files = formData.getAll("files");

    if (typeof categoryValue !== "string" || !allowedCategories.has(categoryValue)) {
      return NextResponse.json({ error: "Invalid upload category." }, { status: 400 });
    }

    const uploadDirectory = path.join(process.cwd(), "public", "uploads", categoryValue);
    await mkdir(uploadDirectory, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File) || file.size === 0) {
        continue;
      }

      const extension = path.extname(file.name) || ".png";
      const safeName = `${Date.now()}-${randomUUID()}${extension}`;
      const destination = path.join(uploadDirectory, safeName);
      const buffer = Buffer.from(await file.arrayBuffer());

      await writeFile(destination, buffer);
      uploadedUrls.push(`/uploads/${categoryValue}/${safeName}`);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Image upload failed."
      },
      { status: 500 }
    );
  }
}
