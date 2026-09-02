import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { List } from "lucide-react";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const CoursesPage = async () => {
  const { userId } = await auth();

  if (!userId || !isTeacher(userId)) {
    return redirect("/sign-in");
  }

  const courses = await db.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Udemy Style Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl min-h-[170px] flex items-center border border-purple-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-purple-200 backdrop-blur-md border border-white/15">
            <List className="h-3.5 w-3.5 text-purple-300" />
            <span>Espace Formateur OFPPT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
            Gestion des Modules & Cours
          </h1>
          <p className="text-sm text-purple-100/80 leading-relaxed font-medium pt-1 max-w-2xl">
            Créez, structurez vos chapitres, ajoutez des supports PDF/EFMs et gérez la publication de vos modules pédagogiques.
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;