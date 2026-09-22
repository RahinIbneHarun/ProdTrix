import { NextRequest, NextResponse } from "next/server";
import { mockProfile, type CarouselItem } from "@/lib/mock-profile-store";

type NoteType = "course" | "book" | "idea";

export async function POST(req: NextRequest) {
  try {
    let noteType: string = "course";
    let name: string = "";
    let imageFile: File | null = null;
    let imageUrl: string = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      noteType = (formData.get("noteType") as string) || "course";
      name = (formData.get("name") as string) || "";
      const file = formData.get("image");
      if (file && typeof file !== "string" && (file as File).size > 0) {
        imageFile = file as File;
      }
    } else {
      const body = await req.json();
      noteType = body.noteType || "course";
      name = body.name || "";
      imageUrl = body.image || "";
    }

    // Fallback if name wasn't entered
    if (!name.trim()) {
      name = `Untitled ${noteType.charAt(0).toUpperCase() + noteType.slice(1)}`;
    }

    // Standardize noteType
    const normalizedType: NoteType = noteType.toLowerCase().includes("book")
      ? "book"
      : noteType.toLowerCase().includes("idea")
        ? "idea"
        : "course";

    // Convert local binary file to a previewable Base64 data URL
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const mimeType = imageFile.type || "image/jpeg";
      imageUrl = `data:${mimeType};base64,${base64}`;
    }

    if (!imageUrl) {
      imageUrl = `https://picsum.photos/seed/${encodeURIComponent(name)}/300/300`;
    }

    const newItem: CarouselItem = {
      name,
      image: imageUrl,
    };

    if (normalizedType === "course") mockProfile.courseItems.unshift(newItem);
    else if (normalizedType === "book") mockProfile.bookItems.unshift(newItem);
    else if (normalizedType === "idea") mockProfile.ideaItems.unshift(newItem);

    return NextResponse.json(mockProfile);
  } catch (error) {
    console.error("Failed to save note:", error);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
