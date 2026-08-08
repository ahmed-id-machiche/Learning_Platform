import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, fileUrl, fileName, comment } = await req.json();

    if (!courseId || !fileUrl) {
      return new NextResponse("Missing courseId or fileUrl", { status: 400 });
    }

    // Find first published chapter of course or fallback
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          where: { isPublished: true },
          take: 1,
        },
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const chapterId = course.chapters[0]?.id || course.id;

    // Create or update submission
    const submission = await db.tpSubmission.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        courseId,
        fileUrl,
        fileName: fileName || "Devoir_PDF.pdf",
        comment,
      },
      create: {
        userId,
        courseId,
        chapterId,
        fileUrl,
        fileName: fileName || "Devoir_PDF.pdf",
        comment,
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.log("[HOMEWORK_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
