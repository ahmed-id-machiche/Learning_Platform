import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TeacherAiPageClient } from "./_components/teacher-ai-client";

const TeacherAiPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-x-2">
          Assistant IA Formateur & Chatbot Pédagogique ✨
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Votre assistant intelligent alimenté par Gemini Flash pour discuter, résumer des cours et générer des examens QCM automatiquement.
        </p>
      </div>

      <TeacherAiPageClient courses={courses} />
    </div>
  );
};

export default TeacherAiPage;
