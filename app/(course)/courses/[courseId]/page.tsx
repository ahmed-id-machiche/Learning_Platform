import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ success?: string }>;
}) => {
  const { userId } = await auth();
  const { courseId } = await params;
  const { success } = await searchParams;

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course || !course.chapters.length) {
    return redirect("/");
  }

  // Auto-enroll when returning from successful Stripe Checkout
  if (userId && (success === "1" || success === "true")) {
    try {
      await db.purchase.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
        update: {},
        create: {
          userId,
          courseId: course.id,
        },
      });
    } catch (e) {
      console.log("[AUTO_ENROLL_AFTER_STRIPE_ERROR]", e);
    }
  }

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;