"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw, Layers, Award, FileCheck, FileText, BookOpen, Filter } from "lucide-react";
import qs from "query-string";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { Category } from "@prisma/client";

interface ResourceFiltersProps {
  categories: Category[];
  totalCount: number;
}

export const ResourceFilters = ({ categories, totalCount }: ResourceFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTitle = searchParams.get("title") || "";
  const currentType = searchParams.get("type") || "";
  const currentCategoryId = searchParams.get("categoryId") || "";

  const [titleValue, setTitleValue] = useState(currentTitle);
  const debouncedTitle = useDebounce(titleValue, 400);

  useEffect(() => {
    setTitleValue(currentTitle);
  }, [currentTitle]);

  useEffect(() => {
    const query = {
      title: debouncedTitle || null,
      type: currentType || null,
      categoryId: currentCategoryId || null,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url, { scroll: false });
  }, [debouncedTitle, currentType, currentCategoryId, pathname, router]);

  const handleTypeChange = (newType?: string) => {
    const query = {
      title: debouncedTitle || null,
      type: newType || null,
      categoryId: currentCategoryId || null,
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

  const handleCategoryChange = (catId: string) => {
    const query = {
      title: debouncedTitle || null,
      type: currentType || null,
      categoryId: catId || null,
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

  const hasActiveFilters = Boolean(currentTitle || currentType || currentCategoryId);

  return (
    <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      {/* Search Input & Category Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute top-3.5 left-3.5 text-slate-400" />
          <Input
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            placeholder="Rechercher un document, EFM, TP, module (ex: M105)..."
            className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-sky-500 text-sm"
          />
        </div>

        {/* Category & Reset controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Selector */}
          <div className="relative">
            <select
              value={currentCategoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="h-10 pl-9 pr-8 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer appearance-none"
            >
              <option value="">Toutes les filières</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Layers className="h-4 w-4 absolute top-3 left-3 text-slate-400 pointer-events-none" />
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

      {/* Filter Tabs / Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTypeChange(undefined)}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition ${
              !currentType
                ? "bg-sky-700 text-white border-sky-700 shadow-xs"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-600 hover:text-sky-700"
            }`}
          >
            Tous les documents
          </button>
          <button
            onClick={() => handleTypeChange("EFM_EXAM")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition flex items-center gap-1.5 ${
              currentType === "EFM_EXAM"
                ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-600 hover:text-amber-700"
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            EFMs Corrigés
          </button>
          <button
            onClick={() => handleTypeChange("TP_CORRIGE")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition flex items-center gap-1.5 ${
              currentType === "TP_CORRIGE"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-600 hover:text-emerald-700"
            }`}
          >
            <FileCheck className="h-3.5 w-3.5" />
            TPs Corrigés
          </button>
          <button
            onClick={() => handleTypeChange("TP_SUJET")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition flex items-center gap-1.5 ${
              currentType === "TP_SUJET"
                ? "bg-sky-700 text-white border-sky-700 shadow-xs"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-600 hover:text-sky-700"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Sujets TP
          </button>
          <button
            onClick={() => handleTypeChange("COURSE_PDF")}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition flex items-center gap-1.5 ${
              currentType === "COURSE_PDF"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-600 hover:text-indigo-700"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Supports PDF
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {totalCount} {totalCount === 1 ? "document" : "documents"} trouvés
        </span>
      </div>
    </div>
  );
};
