import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";

import { Categories } from "./_components/categories";
import { CoursesList } from "@/components/courses-list";

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

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <Suspense fallback={null}>
          <SearchInput />
        </Suspense>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Catalogue des Formations & Modules OFPPT
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Parcourez l'ensemble de vos modules par filières, recherchez par code (ex: M104) ou par mot-clé.
          </p>
        </div>
        <Suspense fallback={null}>
          <Categories items={categories} />
        </Suspense>
        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;