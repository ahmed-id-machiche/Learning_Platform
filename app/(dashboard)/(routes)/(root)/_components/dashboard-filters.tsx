"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw, Filter, CheckCircle2, Clock, Layers } from "lucide-react";
import qs from "query-string";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { Category } from "@prisma/client";

interface DashboardFiltersProps {
  categories: Category[];
}

export const DashboardFilters = ({ categories }: DashboardFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTitle = searchParams.get("title") || "";
  const currentStatus = searchParams.get("status") || "ALL"; // ALL | IN_PROGRESS | COMPLETED
  const currentCategoryId = searchParams.get("categoryId") || "";

  const [titleValue, setTitleValue] = useState(currentTitle);
  const debouncedTitle = useDebounce(titleValue, 400);

  // Sync state if URL changes externally
  useEffect(() => {
    setTitleValue(currentTitle);
  }, [currentTitle]);

  useEffect(() => {
    const query = {
      title: debouncedTitle || null,
      status: currentStatus === "ALL" ? null : currentStatus,
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
  }, [debouncedTitle, currentStatus, currentCategoryId, pathname, router]);

  const handleStatusChange = (newStatus: string) => {
    const query = {
      title: debouncedTitle || null,
      status: newStatus === "ALL" ? null : newStatus,
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
      status: currentStatus === "ALL" ? null : currentStatus,
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

  const hasActiveFilters = Boolean(currentTitle || (currentStatus && currentStatus !== "ALL") || currentCategoryId);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute top-3.5 left-3.5 text-slate-400" />
          <Input
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            placeholder="Rechercher par titre de module, code (ex: M101)..."
            className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-sky-500 text-sm"
          />
        </div>

        {/* Filters right controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
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

          {/* Reset button */}
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

      {/* Status pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={() => handleStatusChange("ALL")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 border ${
            currentStatus === "ALL"
              ? "bg-sky-700 text-white border-sky-700 shadow-xs"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:border-sky-500 hover:text-sky-700"
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          Tous mes modules
        </button>

        <button
          onClick={() => handleStatusChange("IN_PROGRESS")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 border ${
            currentStatus === "IN_PROGRESS"
              ? "bg-amber-600 text-white border-amber-600 shadow-xs"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-500 hover:text-amber-700"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Modules en cours
        </button>

        <button
          onClick={() => handleStatusChange("COMPLETED")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 border ${
            currentStatus === "COMPLETED"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-700"
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Modules terminés
        </button>
      </div>
    </div>
  );
};
