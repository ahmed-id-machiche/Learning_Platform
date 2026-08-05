import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ announcementId: string }> }
) {
  try {
    const { userId } = await auth();
    const { announcementId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const announcement = await db.announcement.findUnique({
      where: {
        id: announcementId,
      },
    });

    if (!announcement) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedAnnouncement = await db.announcement.delete({
      where: {
        id: announcementId,
      },
    });

    return NextResponse.json(deletedAnnouncement);
  } catch (error) {
    console.log("[ANNOUNCEMENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
