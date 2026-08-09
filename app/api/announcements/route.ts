import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, content, courseId, isPinned } = await req.json();

    if (!title || !content) {
      return new NextResponse("Missing title or content", { status: 400 });
    }

    const announcement = await db.announcement.create({
      data: {
        userId,
        title,
        content,
        courseId: courseId || null,
        isPinned: isPinned || false,
      },
      include: {
        course: {
          select: {
            title: true,
            moduleCode: true,
            filiere: true,
          },
        },
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.log("[ANNOUNCEMENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json([]);
    }

    const announcements = await db.announcement.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            moduleCode: true,
            filiere: true,
          },
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
    }).catch(() => []);

    return NextResponse.json(announcements || []);
  } catch (error) {
    console.log("[ANNOUNCEMENTS_GET]", error);
    return NextResponse.json([]);
  }
}
