import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { userId } = await auth();
    const { studentId } = await params;
    const body = await req.json().catch(() => ({}));

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!studentId) {
      return new NextResponse("Student ID missing", { status: 400 });
    }

    const isApproved = typeof body.isApproved === "boolean" ? body.isApproved : true;

    const profile = await db.studentProfile.update({
      where: { userId: studentId },
      data: { isApproved },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[STUDENT_APPROVE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { userId } = await auth();
    const { studentId } = await params;

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!studentId) {
      return new NextResponse("Student ID missing", { status: 400 });
    }

    await db.studentProfile.delete({
      where: { userId: studentId },
    }).catch(() => null);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[STUDENT_APPROVE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
