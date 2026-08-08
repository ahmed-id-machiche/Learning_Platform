"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw, Layers } from "lucide-react";
import qs from "query-string";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { Category } from "@prisma/client";

interface SearchFiltersProps {
  categories: Category[];
}

export const SearchFilters = ({ categories }: SearchFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTitle = searchParams.get("title") || "";
  const currentCategoryId = searchParams.get("categoryId") || "";

  const [titleValue, setTitleValue] = useState(currentTitle);
  const debouncedTitle = useDebounce(titleValue, 400);

  useEffect(() => {
    setTitleValue(currentTitle);
  }, [currentTitle]);

  useEffect(() => {
    const query = {
      title: debouncedTitle || null,
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
  }, [debouncedTitle, currentCategoryId, pathname, router]);

  const handleCategoryChange = (catId: string) => {
    const query = {
      title: debouncedTitle || null,
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

  const hasActiveFilters = Boolean(currentTitle || currentCategoryId);

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="h-4 w-4 absolute top-3.5 left-3.5 text-slate-400" />
        <Input
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          placeholder="Rechercher par titre de module, code (ex: M104), mot-clé..."
          className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-sky-500 text-sm"
        />
      </div>

      {/* Category Dropdown & Reset */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:flex-none">
          <select
            value={currentCategoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full h-10 pl-9 pr-8 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer appearance-none"
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
            className="h-10 rounded-xl text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900 flex items-center gap-1.5 text-xs font-semibold shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  );
};
