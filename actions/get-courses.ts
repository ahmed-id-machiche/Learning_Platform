import { Category, Course } from "@prisma/client";

import { getProgress } from "./get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId?: string | null;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const validCategoryId =
      categoryId &&
      categoryId !== "undefined" &&
      categoryId !== "null" &&
      categoryId.trim() !== ""
        ? categoryId
        : undefined;

    const validTitle =
      title &&
      title !== "undefined" &&
      title !== "null" &&
      title.trim() !== ""
        ? title.trim()
        : undefined;

    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        ...(validTitle ? {
          OR: [
            { title: { contains: validTitle, mode: "insensitive" } },
            { moduleCode: { contains: validTitle, mode: "insensitive" } },
            { filiere: { contains: validTitle, mode: "insensitive" } },
          ],
        } : {}),
        ...(validCategoryId ? { categoryId: validCategoryId } : {}),
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId: userId || "",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        const hasAccess = course.isFree || course.purchases.length > 0;

        const publishedChapterIds = course.chapters.map((chapter) => chapter.id);

        const validCompletedChapters = userId
          ? await db.userProgress.count({
              where: {
                userId,
                chapterId: {
                  in: publishedChapterIds,
                },
                isCompleted: true,
              },
            })
          : 0;

        if (!hasAccess && validCompletedChapters === 0) {
          return {
            ...course,
            progress: null,
          };
        }

        const progressPercentage =
          publishedChapterIds.length === 0
            ? 0
            : (validCompletedChapters / publishedChapterIds.length) * 100;

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
