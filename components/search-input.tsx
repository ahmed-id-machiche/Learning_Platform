"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useDebounce } from "@/hooks/use-debounce";

const SearchInputComponent = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 400);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    // Only trigger navigation if on home or search or dashboard
    if (pathname === "/" || pathname === "/dashboard" || pathname === "/search") {
      const url = qs.stringifyUrl(
        {
          url: "/",
          query: {
            categoryId: currentCategoryId,
            title: debouncedValue,
          },
        },
        { skipEmptyString: true, skipNull: true }
      );

      router.push(url);
    }
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="relative w-full max-w-xl">
      <Search className="h-4 w-4 absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400" />
      <input
        type="text"
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full pl-10 pr-4 py-2 text-xs lg:text-sm text-slate-800 bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-800 rounded-full outline-none transition-all placeholder:text-slate-500 font-medium"
        placeholder="Rechercher un module, TP, EFM ou cours (ex: M101, Comptabilité)..."
      />
    </div>
  );
};

export const SearchInput = () => {
  return (
    <Suspense fallback={
      <div className="w-full max-w-xl h-10 bg-slate-100 rounded-full animate-pulse" />
    }>
      <SearchInputComponent />
    </Suspense>
  );
};