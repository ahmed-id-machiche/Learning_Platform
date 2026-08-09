import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TeacherSubmissionsClient } from "./_components/teacher-submissions-client";

const SubmissionsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
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
  });

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
  });

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
          name: fullName || u.username || (primaryEmail ? primaryEmail.split("@")[0] : "Étudiant"),
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
    studentName: userMap[sub.userId]?.name || `Étudiant (${sub.userId.substring(0, 6)})`,
    studentEmail: userMap[sub.userId]?.email || "",
  }));

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
            Devoirs & Rendus des Étudiants
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed font-normal pt-1 max-w-2xl">
            Gérez l'ensemble des devoirs au format PDF soumis par vos étudiants et attribuez les notes et appréciations.
          </p>
        </div>
      </div>

      <TeacherSubmissionsClient submissions={formattedSubmissions} />
    </div>
  );
};

export default SubmissionsPage;
