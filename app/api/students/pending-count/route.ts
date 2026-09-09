import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId || !isTeacher(userId)) {
      return NextResponse.json({ count: 0 });
    }

    const pendingCount = await db.studentProfile.count({
      where: {
        isApproved: false,
      },
    });

    return NextResponse.json({ count: pendingCount });
  } catch (error) {
    console.error("[PENDING_STUDENTS_COUNT_GET]", error);
    return NextResponse.json({ count: 0 });
  }
}
