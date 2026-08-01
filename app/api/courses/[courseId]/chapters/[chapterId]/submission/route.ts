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
    const { fileUrl, fileName, comment } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const submission = await db.tpSubmission.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        fileUrl,
        fileName: fileName || "TP_Submission",
        comment,
      },
      create: {
        userId,
        courseId,
        chapterId,
        fileUrl,
        fileName: fileName || "TP_Submission",
        comment,
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.log("[TP_SUBMISSION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
