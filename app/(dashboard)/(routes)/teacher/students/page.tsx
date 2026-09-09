import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { TeacherStudentsClient } from "./_components/teacher-students-client";

const StudentsPage = async () => {
  const { userId } = await auth();

  if (!userId || !isTeacher(userId)) {
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

  const studentProfiles = await db.studentProfile.findMany({
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  const profileMap: Record<string, { year: string; filiere: string; isApproved: boolean }> = {};
  studentProfiles.forEach((sp) => {
    profileMap[sp.userId] = {
      year: sp.year,
      filiere: sp.filiere,
      isApproved: sp.isApproved,
    };
  });

  // Unique student user IDs (excluding teachers)
  const studentUserIds = Array.from(
    new Set([
      ...studentProfiles.map((sp) => sp.userId),
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
          name: fullName || u.username || (primaryEmail ? primaryEmail.split("@")[0] : "Stagiaire"),
          email: primaryEmail,
        };
      });
    } catch (e) {
      console.log("Error fetching Clerk users:", e);
    }
  }

  const studentData = studentUserIds.map((studentId) => {
    const studentInfo = userMap[studentId] || {
      name: `Stagiaire (${studentId.substring(0, 8)})`,
      email: "",
    };
    const profile = profileMap[studentId];
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
      year: profile?.year || null,
      filiere: profile?.filiere || null,
      isApproved: profile ? profile.isApproved : true, // default to true if profile not set
      enrolledModules,
      completedModulesCount,
      inProgressModulesCount,
      tpSubmissionsCount: studentSubmissions.length,
      gradedSubmissionsCount: gradedSubmissions.length,
      isBlocked: blockedUserIds.has(studentId),
    };
  });

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Udemy-Style Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl min-h-[170px] flex items-center border border-purple-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-purple-200 backdrop-blur-md border border-white/15">
            <span>Espace Formateur OFPPT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
            Suivi & Progression des Stagiaires
          </h1>
          <p className="text-sm text-purple-100/80 leading-relaxed font-medium pt-1 max-w-2xl">
            Visualisez l'avancement de chaque stagiaire, leurs modules en cours, leurs modules terminés et leurs TPs soumis.
          </p>
        </div>
      </div>

      <TeacherStudentsClient students={studentData} />
    </div>
  );
};

export default StudentsPage;
