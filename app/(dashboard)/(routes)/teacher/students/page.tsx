import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { TeacherStudentsClient } from "./_components/teacher-students-client";

const StudentsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const teacherCourses = await db.course.findMany({
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        select: {
          id: true,
        },
      },
    },
  }).catch(() => []);

  const teacherCourseIds = teacherCourses.map((c) => c.id);

  const courseMap: Record<string, { title: string; moduleCode: string | null; totalChapters: number }> = {};
  teacherCourses.forEach((course) => {
    courseMap[course.id] = {
      title: course.title,
      moduleCode: course.moduleCode,
      totalChapters: course.chapters.length,
    };
  });

  const purchases = await db.purchase.findMany({
    where: {
      courseId: { in: teacherCourseIds },
    },
  }).catch(() => []);

  const userProgresses = await db.userProgress.findMany({
    where: {
      chapter: {
        courseId: { in: teacherCourseIds },
      },
    },
    include: {
      chapter: {
        select: {
          courseId: true,
        },
      },
    },
  }).catch(() => []);

  const submissions = await db.tpSubmission.findMany({
    where: {
      courseId: { in: teacherCourseIds },
    },
  }).catch(() => []);

  const blockedStudents = (await (db as any).blockedStudent?.findMany?.()) || [];
  const blockedUserIds = new Set(blockedStudents.map((b: any) => b.userId));

  // Unique student user IDs (excluding teachers)
  const studentUserIds = Array.from(
    new Set([
      ...purchases.map((p) => p.userId),
      ...userProgresses.map((up) => up.userId),
      ...submissions.map((s) => s.userId),
    ])
  ).filter((id) => id !== userId && !isTeacher(id));

  const userMap: Record<string, { name: string; email: string }> = {};

  if (studentUserIds.length > 0) {
    try {
      const client = await clerkClient();
      const usersResponse = await client.users.getUserList({
        userId: studentUserIds,
      });
      usersResponse.data.forEach((u) => {
        const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
        const primaryEmail =
          u.emailAddresses?.find((e) => e.id === u.primaryEmailAddressId)
            ?.emailAddress || u.emailAddresses[0]?.emailAddress || "";
        userMap[u.id] = {
          name: fullName || u.username || (primaryEmail ? primaryEmail.split("@")[0] : "Étudiant"),
          email: primaryEmail,
        };
      });
    } catch (e) {
      console.log("Error fetching Clerk users:", e);
    }
  }

  const studentData = studentUserIds.map((studentId) => {
    const studentInfo = userMap[studentId] || {
      name: `Étudiant (${studentId.substring(0, 8)})`,
      email: "",
    };
    const studentProgresses = userProgresses.filter((up) => up.userId === studentId);
    const studentSubmissions = submissions.filter((s) => s.userId === studentId);

    // Group progress by course
    const courseStats: Record<string, { completedChapters: number; totalChapters: number }> = {};

    studentProgresses.forEach((up) => {
      const cId = up.chapter.courseId;
      if (!courseStats[cId]) {
        courseStats[cId] = {
          completedChapters: 0,
          totalChapters: courseMap[cId]?.totalChapters || 1,
        };
      }
      if (up.isCompleted) {
        courseStats[cId].completedChapters += 1;
      }
    });

    const enrolledModules = Object.keys(courseStats).map((cId) => {
      const { completedChapters, totalChapters } = courseStats[cId];
      const percentage = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
      const cInfo = courseMap[cId];
      return {
        courseId: cId,
        title: cInfo?.moduleCode ? `[${cInfo.moduleCode}] ${cInfo.title}` : cInfo?.title || "Module",
        percentage,
        isCompleted: percentage === 100,
      };
    });

    const completedModulesCount = enrolledModules.filter((m) => m.isCompleted).length;
    const inProgressModulesCount = enrolledModules.filter((m) => !m.isCompleted).length;

    // Calculate grades average if available
    const gradedSubmissions = studentSubmissions.filter((s) => s.grade);

    return {
      studentId,
      studentName: studentInfo.name,
      studentEmail: studentInfo.email,
      enrolledModules,
      completedModulesCount,
      inProgressModulesCount,
      tpSubmissionsCount: studentSubmissions.length,
      gradedSubmissionsCount: gradedSubmissions.length,
      isBlocked: blockedUserIds.has(studentId),
    };
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-8 text-white shadow-xl min-h-[170px] flex items-center">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
            <span>Espace Formateur OFPPT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Suivi & Progression des Étudiants
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed font-normal pt-1 max-w-2xl">
            Visualisez l'avancement de chaque étudiant, leurs modules en cours, leurs modules terminés et leurs TPs soumis.
          </p>
        </div>
      </div>

      <TeacherStudentsClient students={studentData} />
    </div>
  );
};

export default StudentsPage;
