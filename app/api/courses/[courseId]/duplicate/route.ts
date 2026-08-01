import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
        attachments: true,
      },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Duplicate course
    const newCourse = await db.course.create({
      data: {
        userId,
        title: `${course.title} (Copie)`,
        moduleCode: course.moduleCode,
        filiere: course.filiere,
        niveau: course.niveau,
        description: course.description,
        imageUrl: course.imageUrl,
        price: course.price,
        isFree: course.isFree,
        isPublished: false,
        categoryId: course.categoryId,
        chapters: {
          create: course.chapters.map((chapter) => ({
            title: chapter.title,
            description: chapter.description,
            videoUrl: chapter.videoUrl,
            position: chapter.position,
            isPublished: false,
            isFree: chapter.isFree,
          })),
        },
        attachments: {
          create: course.attachments.map((attachment) => ({
            name: attachment.name,
            url: attachment.url,
            type: attachment.type,
          })),
        },
      },
    });

    return NextResponse.json(newCourse);
  } catch (error) {
    console.log("[COURSE_DUPLICATE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
