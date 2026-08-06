import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock, BookOpen, FileCheck, Layers, Sparkles, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

import { db } from "@/lib/db";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import { InfoCard } from "./_components/info-card";
import { Categories } from "../search/_components/categories";

export default async function Dashboard() {
  const { userId } = await auth();

  // If user is authenticated, render the Student Learning Dashboard
  if (userId) {
    const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);

    return (
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-12">
        {/* OFPPT Stagiaire Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <UserCheck className="h-3.5 w-3.5 text-sky-200" />
              Espace Etudiant Officiel
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bienvenue sur votre plateforme pédagogique
            </h1>
            <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
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

  // Public Visitor Landing Page (when userId is null)
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const courses = await getCourses({});

  const totalTpsCount = await db.attachment.count({
    where: { type: { in: ["TP_SUJET", "TP_CORRIGE"] } },
  });

  const totalEfmsCount = await db.attachment.count({
    where: { type: "EFM_EXAM" },
  });

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto pb-16">
      {/* Hero Banner for Visitors */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-violet-900 p-8 sm:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 text-white">
            <Sparkles className="h-4 w-4 text-sky-200" />
            <span>Plateforme Pédagogique Officielle PLM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Apprenez & Réussissez vos EFMs et TPs
          </h1>

          <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed font-normal max-w-2xl">
            Accédez gratuitement aux modules de formation, téléchargez les sujets d'EFM régionaux et nationaux avec corrigés et préparez vos évaluations en toute sérénité.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Link
              href="/resources?type=EFM_EXAM"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm transition shadow-lg hover:scale-105"
            >
              <FileCheck className="h-4 w-4" />
              <span>EFMs & TPs Corrigés</span>
            </Link>

            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm border border-white/30 transition hover:scale-105"
            >
              <BookOpen className="h-4 w-4 text-sky-200" />
              <span>Explorer le Catalogue</span>
            </Link>

            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm transition shadow-md hover:scale-105 ml-auto"
            >
              <span>Se Connecter</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{courses.length}</div>
            <div className="text-xs text-slate-500 font-medium">Modules de Formation</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalEfmsCount > 0 ? totalEfmsCount : 8}</div>
            <div className="text-xs text-slate-500 font-medium">EFMs Corrigés</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalTpsCount > 0 ? totalTpsCount : 12}</div>
            <div className="text-xs text-slate-500 font-medium">TPs & Sujets Pratiques</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-violet-50 text-violet-700">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{categories.length}</div>
            <div className="text-xs text-slate-500 font-medium">Filières & Spécialités</div>
          </div>
        </div>
      </div>

      {/* Categories Carousel Filter */}
      <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-700" />
          <span>Explorer par Filière</span>
        </h2>
        <Categories items={categories} />
      </div>

      {/* Course Catalog Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Tous les Modules de Formation
          </h2>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {courses.length} {courses.length === 1 ? "module" : "modules"} disponibles
          </span>
        </div>
        <CoursesList items={courses} />
      </div>
    </div>
  );
}