import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckCircle, Clock, GraduationCap } from "lucide-react";
import { Suspense } from "react";

import { db } from "@/lib/db";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { getStudentProfile } from "@/actions/student-profile";
import { CoursesList } from "@/components/courses-list";

import { InfoCard } from "../(root)/_components/info-card";
import { DashboardFilters } from "../(root)/_components/dashboard-filters";

interface DashboardProps {
  searchParams: Promise<{
    title?: string;
    status?: string;
    categoryId?: string;
  }>;
}

export default async function StudentDashboard({ searchParams }: DashboardProps) {
  const { userId } = await auth();
  const { title, status, categoryId } = await searchParams;

  if (!userId) {
    return redirect("/sign-in");
  }

  const profile = await getStudentProfile(userId);

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  }).catch(() => []);

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
      const matchFiliere = course.filiere?.toLowerCase().includes(query);
      if (!matchTitle && !matchCode && !matchCat && !matchFiliere) {
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
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Udemy-Style Student Dashboard Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl min-h-[170px] flex items-center border border-purple-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-purple-200 border border-white/10">
            <GraduationCap className="h-4 w-4 text-purple-300" />
            <span>
              Espace Stagiaire OFPPT
              {profile ? ` • ${profile.year} (${profile.filiere})` : ""}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
            Mon Apprentissage & Progression
          </h1>
          <p className="text-sm text-purple-100/80 leading-relaxed font-medium max-w-2xl">
            {profile
              ? `Bienvenue ! Suivez votre avancement et reprenez rapidement vos modules pour ${profile.year} (${profile.filiere}).`
              : "Visualisez vos modules en cours, vos cours terminés et suivez votre progression."}
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Mes Modules d'Apprentissage
          </h2>
          <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
            {displayedCourses.length} {displayedCourses.length === 1 ? "module" : "modules"}
          </span>
        </div>
        <CoursesList items={displayedCourses} />
      </div>
    </div>
  );
}
