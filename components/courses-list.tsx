"use client";

import { Category, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
import { BookX } from "lucide-react";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            moduleCode={item.moduleCode}
            filiere={item.filiere}
            isFree={item.isFree}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            category={item?.category?.name || "Général"}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 my-6 space-y-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500">
            <BookX className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Aucun module trouvé
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Essayer de réinitialiser vos filtres ou d'effectuer une recherche avec un autre mot-clé ou code de module (ex: M104).
          </p>
        </div>
      )}
    </div>
  );
};

