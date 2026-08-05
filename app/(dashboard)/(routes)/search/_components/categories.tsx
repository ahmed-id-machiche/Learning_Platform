"use client";

import { useRef, useState, useEffect } from "react";
import { Category } from "@prisma/client";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import {
  FcAdvertising,
  FcBriefcase,
  FcCalculator,
  FcDepartment,
  FcEngineering,
  FcFilmReel,
  FcGlobe,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcOrganization,
  FcRules,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import { IconType } from "react-icons";

import { CategoryItem } from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<string, IconType> = {
  "Gestion des Entreprises": FcBriefcase,
  "Commerce Digital & Marketing": FcSalesPerformance,
  "Comptabilité & Finance": FcCalculator,
  "Logistique & Transport": FcGlobe,
  "Techniques de Vente": FcAdvertising,
  "Administration & RH": FcDepartment,
  "Développement Digital": FcMultipleDevices,
  "Infrastructure Digitale": FcOrganization,
  Accounting: FcCalculator,
  "Computer Science": FcMultipleDevices,
  Engineering: FcEngineering,
  "Web Development": FcMultipleDevices,
};

export const Categories = ({ items }: CategoriesProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 5);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/carousel py-1">
      {/* Left Scroll Button */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-110 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Right Scroll Button */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-110 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
          aria-label="Scroll Right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Categories Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex items-center gap-x-2.5 overflow-x-auto py-2 px-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* All Modules Pill */}
        <CategoryItem label="Tous les modules" value={undefined} icon={LayoutGrid} />

        {items.map((item) => (
          <CategoryItem
            key={item.id}
            label={item.name}
            icon={iconMap[item.name] || FcMultipleDevices}
            value={item.id}
          />
        ))}
      </div>
    </div>
  );
};