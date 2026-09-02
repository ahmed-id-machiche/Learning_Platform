import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen, FileCheck, Layers, FileText } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { db } from "@/lib/db";
import { getCourses } from "@/actions/get-courses";
import { getStudentProfile } from "@/actions/student-profile";
import { HeroSection } from "@/components/hero-section";
import { CoursesList } from "@/components/courses-list";

import { Categories } from "../search/_components/categories";
import { SearchFilters } from "../search/_components/search-filters";

interface HomePageProps {
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { userId } = await auth();
  const { title, categoryId } = await searchParams;

  if (!userId) {
    return redirect("/sign-in");
  }

  const [profile, categories, courses, totalCourses, totalTpsCount, totalEfmsCount, totalAttachments] =
    await Promise.all([
      getStudentProfile(userId),
      db.category.findMany({ orderBy: { name: "asc" } }).catch(() => []),
      getCourses({ userId, title, categoryId }).catch(() => []),
      db.course.count({ where: { isPublished: true } }).catch(() => 0),
      db.attachment.count({ where: { type: { in: ["TP_SUJET", "TP_CORRIGE"] } } }).catch(() => 0),
      db.attachment.count({ where: { type: "EFM_EXAM" } }).catch(() => 0),
      db.attachment.count().catch(() => 0),
    ]);

  const totalTps = totalTpsCount > 0 ? totalTpsCount : Math.max(totalAttachments, 12);
  const totalEfms = totalEfmsCount > 0 ? totalEfmsCount : 8;

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="min-h-full pb-10 space-y-6">
      {/* 1. Hero Section below Navbar */}
      <HeroSection profile={profile} />

      {/* 2. Main Catalogue Content */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Interactive Search & Filter Bar */}
        <Suspense fallback={null}>
          <SearchFilters categories={categories} />
        </Suspense>

        {/* Category Filter Carousel Section */}
        <div id="categories-section" className="space-y-3 scroll-mt-24">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Layers className="h-4 w-4 text-sky-700" />
              Filtrer par Filière / Catégorie
            </h2>
            {selectedCategory && (
              <span className="text-xs font-medium text-slate-500">
                Filière sélectionnée: <strong className="text-sky-700">{selectedCategory.name}</strong>
              </span>
            )}
          </div>
          <Suspense fallback={null}>
            <Categories items={categories} />
          </Suspense>
        </div>

        {/* Courses Section */}
        <div id="modules-section" className="space-y-4 pt-2 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {selectedCategory ? `Modules en ${selectedCategory.name}` : title ? `Résultats pour "${title}"` : "Tous les Modules de Formation"}
              </h2>
              <span className="bg-sky-50 text-sky-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
                {courses.length} {courses.length === 1 ? "module" : "modules"}
              </span>
            </div>
          </div>

          <CoursesList items={courses} />
        </div>
      </div>
    </div>
  );
}