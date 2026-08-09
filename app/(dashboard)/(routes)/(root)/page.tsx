import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";
import { Suspense } from "react";

import { db } from "@/lib/db";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";

import { InfoCard } from "./_components/info-card";
import { DashboardFilters } from "./_components/dashboard-filters";

interface DashboardProps {
  searchParams: Promise<{
    title?: string;
    status?: string;
    categoryId?: string;
  }>;
}

export default async function Dashboard({ searchParams }: DashboardProps) {
  const { userId } = await auth();
  const { title, status, categoryId } = await searchParams;

  if (!userId) {
    return redirect("/sign-in");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  // Filter courses based on search params
  const filterCourse = (course: any) => {
    if (categoryId && course.categoryId !== categoryId) {
      return false;
    }

    if (title) {
      const query = title.toLowerCase();
      const matchTitle = course.title?.toLowerCase().includes(query);
      const matchCode = course.moduleCode?.toLowerCase().includes(query);
      const matchCat = course.category?.name?.toLowerCase().includes(query);
      if (!matchTitle && !matchCode && !matchCat) {
        return false;
      }
    }

    return true;
  };

  const filteredInProgress = coursesInProgress.filter(filterCourse);
  const filteredCompleted = completedCourses.filter(filterCourse);

  let displayedCourses: any[] = [];
  if (status === "IN_PROGRESS") {
    displayedCourses = filteredInProgress;
  } else if (status === "COMPLETED") {
    displayedCourses = filteredCompleted;
  } else {
    displayedCourses = [...filteredInProgress, ...filteredCompleted];
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* OFPPT Stagiaire Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-8 text-white shadow-xl min-h-[170px] flex items-center">
        {/* Subtle ambient lighting glows */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Bienvenue sur votre plateforme pédagogique
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed font-normal pt-1.5 max-w-2xl">
            Consultez vos modules de formation, téléchargez vos TPs, préparez vos EFMs et suivez votre progression en temps réel.
          </p>
        </div>
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

      {/* Interactive Search & Filter Bar */}
      <Suspense fallback={null}>
        <DashboardFilters categories={categories} />
      </Suspense>

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Mes Modules d'Apprentissage
          </h2>
          <span className="bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full border border-sky-200">
            {displayedCourses.length} {displayedCourses.length === 1 ? "module" : "modules"}
          </span>
        </div>
        <CoursesList items={displayedCourses} />
      </div>
    </div>
  );
}