import { NextRequest, NextResponse } from "next/server";
import { mockProfile, type ProfileData } from "@/lib/mock-profile-store";

export async function GET() {
  return NextResponse.json(mockProfile);
}

export async function PATCH(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const allowedKeys: (keyof ProfileData)[] = [
      "name",
      "field",
      "email",
      "status",
      "bio",
      "coverPhoto",
      "avatarPhoto",
    ];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const field = formData.get("field") as keyof ProfileData | null;
      const file = formData.get("file") as File | null;

      if (field && file && allowedKeys.includes(field)) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const mimeType = file.type || "image/jpeg";
        (mockProfile as any)[field] =
          `data:${mimeType};base64,${buffer.toString("base64")}`;
      }
    } else {
      const body = await req.json();
      for (const key of allowedKeys) {
        if (key in body) {
          (mockProfile as any)[key] = body[key];
        }
      }
    }

    return NextResponse.json(mockProfile);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
