import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

// PATCH: Block or Unblock a student
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { userId } = await auth();
    const { studentId } = await params;
    const { isBlocked } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (isBlocked) {
      await db.blockedStudent.upsert({
        where: { userId: studentId },
        update: {
          reason: "Bloqué par le formateur",
        },
        create: {
          userId: studentId,
          reason: "Bloqué par le formateur",
        },
      });

      // Revoke all active Clerk sign-in sessions for immediate logout
      try {
        const client = await clerkClient();
        await client.users.revokeSignInSessions({ userId: studentId });
      } catch (clerkErr) {
        console.log("[CLERK_SESSION_REVOKE_ERROR]", clerkErr);
      }
    } else {
      await db.blockedStudent.deleteMany({
        where: { userId: studentId },
      });
    }

    return NextResponse.json({ success: true, isBlocked });
  } catch (error) {
    console.log("[STUDENT_BLOCK_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE: Completely remove student's enrollments and progress
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

    // Delete student purchases, progress, submissions & blocked records
    await Promise.all([
      db.purchase.deleteMany({ where: { userId: studentId } }),
      db.userProgress.deleteMany({ where: { userId: studentId } }),
      db.tpSubmission.deleteMany({ where: { userId: studentId } }),
      db.blockedStudent.deleteMany({ where: { userId: studentId } }),
    ]);

    // Revoke sessions
    try {
      const client = await clerkClient();
      await client.users.revokeSignInSessions({ userId: studentId });
    } catch (e) {
      console.log("[CLERK_SESSION_REVOKE_DELETE_ERROR]", e);
    }

    return NextResponse.json({ success: true, message: "Student access removed" });
  } catch (error) {
    console.log("[STUDENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
