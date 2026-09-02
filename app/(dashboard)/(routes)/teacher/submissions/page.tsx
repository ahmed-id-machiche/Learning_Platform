import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { TeacherSubmissionsClient } from "./_components/teacher-submissions-client";

const SubmissionsPage = async () => {
  const { userId } = await auth();

  if (!userId || !isTeacher(userId)) {
    return redirect("/sign-in");
  }

  const teacherCourses = await db.course.findMany({
    include: {
      chapters: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  }).catch(() => []);

  const teacherCourseIds = teacherCourses.map((c) => c.id);

  const submissions = await db.tpSubmission.findMany({
    where: {
      courseId: {
        in: teacherCourseIds,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  }).catch(() => []);

  const courseMap: Record<string, string> = {};
  const chapterMap: Record<string, string> = {};

  teacherCourses.forEach((course) => {
    courseMap[course.id] = course.moduleCode ? `[${course.moduleCode}] ${course.title}` : course.title;
    course.chapters.forEach((chapter) => {
      chapterMap[chapter.id] = chapter.title;
    });
  });

  const submissionUserIds = Array.from(new Set(submissions.map((s) => s.userId)));
  const userMap: Record<string, { name: string; email: string }> = {};

  if (submissionUserIds.length > 0) {
    try {
      const client = await clerkClient();
      const usersResponse = await client.users.getUserList({
        userId: submissionUserIds,
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

  const formattedSubmissions = submissions.map((sub) => ({
    ...sub,
    courseTitle: courseMap[sub.courseId] || "Module OFPPT",
    chapterTitle: chapterMap[sub.chapterId] || "Chapitre",
    studentName: userMap[sub.userId]?.name || `Stagiaire (${sub.userId.substring(0, 6)})`,
    studentEmail: userMap[sub.userId]?.email || "",
  }));

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
            Devoirs & Rendus des Stagiaires
          </h1>
          <p className="text-sm text-purple-100/80 leading-relaxed font-medium pt-1 max-w-2xl">
            Consultez les devoirs au format PDF transmis par vos stagiaires, évaluez les travaux et attribuez les notes et appréciations.
          </p>
        </div>
      </div>

      <TeacherSubmissionsClient submissions={formattedSubmissions} />
    </div>
  );
};

export default SubmissionsPage;
