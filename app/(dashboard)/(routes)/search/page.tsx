import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen, FileCheck, Layers, Sparkles, FileText } from "lucide-react";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";

import { Categories } from "./_components/categories";
import { CoursesList } from "@/components/courses-list";
import { Breadcrumbs } from "@/components/breadcrumb";

import { Suspense } from "react";

interface SearchPageProps {
  searchParams: Promise<{
    title?: string;
    categoryId?: string;
  }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();
  const { title, categoryId } = await searchParams;

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({
    userId,
    title,
    categoryId,
  });

  // Calculate live statistics
  const totalCourses = await db.course.count({
    where: { isPublished: true },
  });

  const totalTpsCount = await db.attachment.count({
    where: {
      type: {
        in: ["TP_SUJET", "TP_CORRIGE"],
      },
    },
  });

  const totalEfmsCount = await db.attachment.count({
    where: {
      type: "EFM_EXAM",
    },
  });

  const totalAttachments = await db.attachment.count();
  const totalTps = totalTpsCount > 0 ? totalTpsCount : Math.max(totalAttachments, 12);
  const totalEfms = totalEfmsCount > 0 ? totalEfmsCount : 8;

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <div className="min-h-full pb-10">
      {/* Mobile search bar */}
      <div className="px-6 pt-6 md:hidden block">
        <Suspense fallback={null}>
          <SearchInput />
        </Suspense>
      </div>

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        {/* Fil d'ariane / Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Catalogue & Modules", iconName: "compass" },
            ...(selectedCategory ? [{ label: selectedCategory.name }] : []),
          ]}
        />

        {/* Platform-Aligned Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-8 md:p-10 text-white shadow-xl">
          {/* Subtle ambient lighting glows */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Main Header Text */}
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                <Sparkles className="h-3.5 w-3.5 text-sky-200" />
                <span>Catalogue Pédagogique Officiel OFPPT</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
                Catalogue des Formations & Modules
              </h1>

              <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal pt-1">
                Explorez vos modules par filières, accédez aux travaux pratiques (TPs) corrigés, téléchargez les EFMs et maîtrisez vos compétences métier.
              </p>
            </div>

            {/* Live Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 shrink-0 lg:w-80">
              <div className="group rounded-xl bg-white/15 p-3.5 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20 text-white group-hover:scale-105 transition-transform">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white tracking-tight">{totalCourses}</div>
                    <div className="text-[11px] font-medium text-blue-100">Modules</div>
                  </div>
                </div>
              </div>

              <div className="group rounded-xl bg-white/15 p-3.5 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20 text-white group-hover:scale-105 transition-transform">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white tracking-tight">{totalTps}+</div>
                    <div className="text-[11px] font-medium text-blue-100">TPs & Sujets</div>
                  </div>
                </div>
              </div>

              <div className="group rounded-xl bg-white/15 p-3.5 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20 text-white group-hover:scale-105 transition-transform">
                    <FileCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white tracking-tight">{totalEfms}+</div>
                    <div className="text-[11px] font-medium text-blue-100">EFMs Corrigés</div>
                  </div>
                </div>
              </div>

              <div className="group rounded-xl bg-white/15 p-3.5 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20 text-white group-hover:scale-105 transition-transform">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white tracking-tight">{categories.length}</div>
                    <div className="text-[11px] font-medium text-blue-100">Filières</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Carousel Section */}
        <div className="space-y-3">
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
        <div className="space-y-4 pt-2">
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
};

export default SearchPage;