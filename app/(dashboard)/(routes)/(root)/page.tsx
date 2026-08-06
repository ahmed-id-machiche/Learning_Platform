import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";

import { InfoCard } from "./_components/info-card";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  return (
    <div className="p-6 space-y-6">
      {/* OFPPT Stagiaire Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-6 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-3">
            Espace Etudiant
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bienvenue sur votre plateforme pédagogique
          </h1>
          <p className="mt-2 text-sm text-blue-100 leading-relaxed">
            Consultez vos modules de formation, téléchargez vos TPs, préparez vos EFMs et suivez votre progression en temps réel.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="Modules en cours"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Modules terminés"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Mes Modules d'Apprentissage</h2>
        <CoursesList items={[...coursesInProgress, ...completedCourses]} />
      </div>
    </div>
  );
}