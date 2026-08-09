import { auth } from "@clerk/nextjs/server";
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

    const blockedModel = (db as any).blockedStudent;

    if (isBlocked) {
      if (blockedModel?.upsert) {
        await blockedModel.upsert({
          where: { userId: studentId },
          update: {},
          create: {
            userId: studentId,
            reason: "Bloqué par le formateur",
          },
        });
      } else {
        await db.$executeRawUnsafe(
          `INSERT INTO "BlockedStudent" ("_id", "userId", "reason", "createdAt") VALUES (gen_random_uuid()::text, $1, 'Bloqué par le formateur', NOW()) ON CONFLICT ("userId") DO NOTHING`,
          studentId
        );
      }
    } else {
      if (blockedModel?.deleteMany) {
        await blockedModel.deleteMany({
          where: { userId: studentId },
        });
      } else {
        await db.$executeRawUnsafe(
          `DELETE FROM "BlockedStudent" WHERE "userId" = $1`,
          studentId
        );
      }
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

    const blockedModel = (db as any).blockedStudent;

    // Delete student purchases, progress, submissions & blocked records
    await Promise.all([
      db.purchase.deleteMany({ where: { userId: studentId } }),
      db.userProgress.deleteMany({ where: { userId: studentId } }),
      db.tpSubmission.deleteMany({ where: { userId: studentId } }),
      blockedModel?.deleteMany
        ? blockedModel.deleteMany({ where: { userId: studentId } })
        : db.$executeRawUnsafe(`DELETE FROM "BlockedStudent" WHERE "userId" = $1`, studentId).catch(() => {}),
    ]);

    return NextResponse.json({ success: true, message: "Student access removed" });
  } catch (error) {
    console.log("[STUDENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
