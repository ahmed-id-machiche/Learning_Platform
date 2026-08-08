import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; submissionId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, submissionId } = await params;
    const { grade, comment } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isTeacherUser = isTeacher(userId);
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (!isTeacherUser && courseOwner.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const submission = await db.tpSubmission.update({
      where: {
        id: submissionId,
      },
      data: {
        grade,
        comment,
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.log("[TP_SUBMISSION_GRADE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
