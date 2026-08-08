"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw, Pin, BookOpen, Filter } from "lucide-react";
import qs from "query-string";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

interface AnnouncementFiltersProps {
  courses: { id: string; title: string; moduleCode: string | null }[];
}

export const AnnouncementFilters = ({ courses }: AnnouncementFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTitle = searchParams.get("title") || "";
  const currentPinned = searchParams.get("pinned") || ""; // "true" | ""
  const currentCourseId = searchParams.get("courseId") || "";

  const [titleValue, setTitleValue] = useState(currentTitle);
  const debouncedTitle = useDebounce(titleValue, 400);

  useEffect(() => {
    setTitleValue(currentTitle);
  }, [currentTitle]);

  useEffect(() => {
    const query = {
      title: debouncedTitle || null,
      pinned: currentPinned || null,
      courseId: currentCourseId || null,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url, { scroll: false });
  }, [debouncedTitle, currentPinned, currentCourseId, pathname, router]);

  const handlePinnedToggle = (val: string) => {
    const query = {
      title: debouncedTitle || null,
      pinned: val || null,
      courseId: currentCourseId || null,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url, { scroll: false });
  };

  const handleCourseChange = (cId: string) => {
    const query = {
      title: debouncedTitle || null,
      pinned: currentPinned || null,
      courseId: cId || null,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url, { scroll: false });
  };

  const handleReset = () => {
    setTitleValue("");
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = Boolean(currentTitle || currentPinned || currentCourseId);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute top-3.5 left-3.5 text-slate-400" />
          <Input
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            placeholder="Rechercher une annonce, un mot-clé (ex: examen, TP)..."
            className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-sky-500 text-sm"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Module Selector */}
          <div className="relative">
            <select
              value={currentCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="h-10 pl-9 pr-8 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer appearance-none max-w-[220px] truncate"
            >
              <option value="">Tous les modules</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.moduleCode ? `[${course.moduleCode}] ` : ""}{course.title}
                </option>
              ))}
            </select>
            <BookOpen className="h-4 w-4 absolute top-3 left-3 text-slate-400 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="h-10 rounded-xl text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900 flex items-center gap-1.5 text-xs font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Pinned filter buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={() => handlePinnedToggle("")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 border ${
            !currentPinned
              ? "bg-sky-700 text-white border-sky-700 shadow-xs"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-500 hover:text-sky-700"
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          Toutes les annonces
        </button>

        <button
          onClick={() => handlePinnedToggle("true")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 border ${
            currentPinned === "true"
              ? "bg-amber-600 text-white border-amber-600 shadow-xs"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-500 hover:text-amber-700"
          }`}
        >
          <Pin className="h-3.5 w-3.5" />
          Épinglées uniquement
        </button>
      </div>
    </div>
  );
};
