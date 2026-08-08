import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { HomeworkSubmissionClient } from "./_components/homework-submission-client";

export default async function HomeworkPage() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
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
  });

  // Fetch student's submitted homework
  const submissions = await db.tpSubmission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

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
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-8 md:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
            <Sparkles className="h-3.5 w-3.5 text-sky-200" />
            <span>Espace Dépôt de Devoirs OFPPT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Devoirs & Travaux Pratiques
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
            Soumettez vos devoirs et travaux pratiques au format PDF à vos formateurs et suivez vos corrections et notes attribuées.
          </p>
        </div>
      </div>

      {/* Main Homework Client Component */}
      <HomeworkSubmissionClient courses={courses} submissions={formattedSubmissions} />
    </div>
  );
}
