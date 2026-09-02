import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { HomeworkSubmissionClient } from "./_components/homework-submission-client";

export default async function HomeworkPage() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  // Fetch published courses for course selector
  const courses = await db.course.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      moduleCode: true,
    },
    orderBy: { title: "asc" },
  }).catch(() => []);

  // Fetch student's submitted homework
  const submissions = await db.tpSubmission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  const courseMap: Record<string, { title: string; moduleCode: string | null }> = {};
  courses.forEach((c) => {
    courseMap[c.id] = { title: c.title, moduleCode: c.moduleCode };
  });

  const formattedSubmissions = submissions.map((sub) => {
    const cInfo = courseMap[sub.courseId];
    return {
      id: sub.id,
      courseId: sub.courseId,
      courseTitle: cInfo?.moduleCode ? `[${cInfo.moduleCode}] ${cInfo.title}` : cInfo?.title || "Module OFPPT",
      fileName: sub.fileName,
      fileUrl: sub.fileUrl,
      comment: sub.comment,
      grade: sub.grade,
      createdAt: sub.createdAt,
    };
  });

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Udemy-Style Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl min-h-[170px] flex items-center border border-purple-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
            Devoirs & Travaux Pratiques
          </h1>
          <p className="text-sm text-purple-100/80 leading-relaxed font-medium pt-1 max-w-2xl">
            Soumettez vos devoirs et travaux pratiques au format PDF à vos formateurs et suivez vos corrections et notes attribuées.
          </p>
        </div>
      </div>

      {/* Main Homework Client Component */}
      <HomeworkSubmissionClient courses={courses} submissions={formattedSubmissions} />
    </div>
  );
}
