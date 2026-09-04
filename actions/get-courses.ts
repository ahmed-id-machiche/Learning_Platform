import { Category, Course } from "@prisma/client";
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

export function isCourseVisibleToStudent(
  courseFiliere: string | null | undefined,
  studentYear?: string | null,
  studentFiliere?: string | null
): boolean {
  if (!courseFiliere || courseFiliere.trim() === "" || courseFiliere.toLowerCase().includes("général") || courseFiliere.toLowerCase().includes("general")) {
    return true; // General course, visible to all
  }

  if (!studentFiliere) {
    return true; // No profile filter set, visible
  }

  const normalizedCourseFiliere = courseFiliere.toLowerCase().replace(/[-_]/g, " ").trim();
  const normalizedStudentFiliere = studentFiliere.toLowerCase().replace(/[-_]/g, " ").trim();

  // Check year indicators
  const isCourseFirstYear = normalizedCourseFiliere.includes("1ère") || normalizedCourseFiliere.includes("1ere") || normalizedCourseFiliere.includes("1er");
  const isStudentFirstYear = studentYear ? (studentYear.includes("1ère") || studentYear.includes("1ere") || studentYear.includes("1er")) : (normalizedStudentFiliere.includes("1ère") || normalizedStudentFiliere.includes("1ere") || normalizedStudentFiliere.includes("1er"));

  if (isStudentFirstYear) {
    // 1ère Année student MUST NOT see 2ème Année courses!
    if (!isCourseFirstYear) return false;

    // Must match TSGE vs TAA Tronc Commun
    if (normalizedStudentFiliere.includes("tsge") && !normalizedCourseFiliere.includes("tsge")) return false;
    if (normalizedStudentFiliere.includes("taa") && !normalizedCourseFiliere.includes("taa")) return false;
    return true;
  } else {
    // 2ème Année student MUST NOT see 1ère Année courses!
    if (isCourseFirstYear) return false;

    // Extract option identifiers (e.g. "cf", "cm", "om", "rh", "comptabilite", "gestion")
    const studentTokens = normalizedStudentFiliere.split(" ").filter(t => t.length >= 2);
    const courseTokens = normalizedCourseFiliere.split(" ").filter(t => t.length >= 2);

    const optionMatches = studentTokens.some(st => 
      courseTokens.some(ct => ct === st || ct.includes(st) || st.includes(ct))
    );

    return optionMatches;
  }
}

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

    // Fetch student profile for automatic year & filière filtering
    const studentProfile = userId
      ? await db.studentProfile.findUnique({ where: { userId } }).catch(() => null)
      : null;

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

    // Filter courses based on student's year and filière
    const filteredCourses = courses.filter((course) => {
      if (!studentProfile) return true;
      return isCourseVisibleToStudent(course.filiere, studentProfile.year, studentProfile.filiere);
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      filteredCourses.map(async (course) => {
        const purchases = course.purchases || [];
        const isFree = course.isFree ?? (course.price === null || course.price === 0);
        const hasAccess = isFree || purchases.length > 0;

        const publishedChapterIds = (course.chapters || []).map((chapter) => chapter.id);

        let validCompletedChapters = 0;
        if (userId && publishedChapterIds.length > 0) {
          validCompletedChapters = await db.userProgress.count({
            where: {
              userId,
              chapterId: {
                in: publishedChapterIds,
              },
              isCompleted: true,
            },
          }).catch(() => 0);
        }

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
    console.log("[GET_COURSES_ERROR]", error);
    try {
      const fallbackCourses = await db.course.findMany({
        where: { isPublished: true },
        include: {
          category: true,
          chapters: { where: { isPublished: true }, select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return fallbackCourses.map((c) => ({ ...c, progress: null }));
    } catch {
      return [];
    }
  }
};
