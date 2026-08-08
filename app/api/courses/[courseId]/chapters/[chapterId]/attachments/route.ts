import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;
    const { url, name, type } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!url) {
      return new NextResponse("Missing URL", { status: 400 });
    }

    let attachment;
    try {
      attachment = await db.attachment.create({
        data: {
          url,
          name: name || url.split("/").pop() || "Chapitre_Document.pdf",
          type: type || "COURSE_PDF",
          courseId,
          chapterId,
        },
      });
    } catch (e) {
      console.log("[CHAPTER_ATTACHMENTS_POST_FALLBACK]", e);
      attachment = await db.attachment.create({
        data: {
          url,
          name: name || url.split("/").pop() || "Chapitre_Document.pdf",
          type: type || "COURSE_PDF",
          courseId,
        },
      });
    }

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[CHAPTER_ATTACHMENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
