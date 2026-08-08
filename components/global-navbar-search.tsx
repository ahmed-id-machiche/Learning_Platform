"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Compass, FileCheck, Bell, LayoutGrid, X } from "lucide-react";
import qs from "query-string";
import { useDebounce } from "@/hooks/use-debounce";

const SEARCH_SCOPES = [
  { id: "search", label: "Catalogue & Modules", href: "/search", icon: Compass },
  { id: "resources", label: "EFMs & TPs Corrigés", href: "/resources", icon: FileCheck },
  { id: "announcements", label: "Annonces OFPPT", href: "/announcements", icon: Bell },
  { id: "dashboard", label: "Mon Tableau de Bord", href: "/", icon: LayoutGrid },
];

export const GlobalNavbarSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTitle = searchParams.get("title") || "";
  const [value, setValue] = useState(currentTitle);
  const debouncedValue = useDebounce(value, 400);

  // Sync with URL query parameter
  useEffect(() => {
    setValue(currentTitle);
  }, [currentTitle]);

  // Determine selected scope based on current pathname
  const getCurrentScopeId = () => {
    if (pathname === "/resources") return "resources";
    if (pathname === "/announcements") return "announcements";
    if (pathname === "/") return "dashboard";
    return "search";
  };

  const [selectedScopeId, setSelectedScopeId] = useState(getCurrentScopeId());

  useEffect(() => {
    setSelectedScopeId(getCurrentScopeId());
  }, [pathname]);

  // Handle search value update
  useEffect(() => {
    if (debouncedValue === currentTitle) return;

    const currentScope = SEARCH_SCOPES.find((s) => s.id === selectedScopeId) || SEARCH_SCOPES[0];
    const targetHref = pathname?.startsWith("/teacher") ? "/search" : (pathname || currentScope.href);

    const query = {
      ...qs.parse(searchParams.toString()),
      title: debouncedValue || null,
    };

    const url = qs.stringifyUrl(
      {
        url: targetHref,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url, { scroll: false });
  }, [debouncedValue]);

  // Handle scope dropdown change
  const handleScopeChange = (newScopeId: string) => {
    setSelectedScopeId(newScopeId);
    const targetScope = SEARCH_SCOPES.find((s) => s.id === newScopeId) || SEARCH_SCOPES[0];

    const url = qs.stringifyUrl(
      {
        url: targetScope.href,
        query: {
          title: debouncedValue || null,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url, { scroll: false });
  };

  const handleClear = () => {
    setValue("");
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          ...qs.parse(searchParams.toString()),
          title: null,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url, { scroll: false });
  };

  return (
    <div className="relative flex items-center w-full max-w-xl bg-slate-100/90 hover:bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-500/50 rounded-2xl border border-slate-200/80 transition-all duration-200 shadow-2xs">
      {/* Scope Selector Dropdown */}
      <div className="relative shrink-0 border-r border-slate-200">
        <select
          value={selectedScopeId}
          onChange={(e) => handleScopeChange(e.target.value)}
          className="h-10 pl-3 pr-7 text-xs font-bold text-sky-800 bg-transparent focus:outline-none cursor-pointer appearance-none"
        >
          {SEARCH_SCOPES.map((scope) => (
            <option key={scope.id} value={scope.id} className="text-slate-800 font-medium">
              {scope.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-3 pointer-events-none text-slate-400">
          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {/* Input Icon */}
      <Search className="h-4 w-4 ml-3 text-slate-400 shrink-0 pointer-events-none" />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Recherche globale (ex: M101, Incoterms, EFM...)"
        className="w-full h-10 px-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none font-normal"
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="mr-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          title="Effacer la recherche"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
