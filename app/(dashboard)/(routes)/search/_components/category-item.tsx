"use client";

import qs from "query-string";
import { ElementType } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategoryItemProps {
  label: string;
  value?: string;
  icon?: ElementType;
}

export const CategoryItem = ({
  label,
  value,
  icon: Icon,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative py-2 px-3 text-sm font-medium rounded-full flex items-center gap-x-1.5 whitespace-nowrap transition-all duration-200 select-none cursor-pointer border shrink-0",
        isSelected
          ? "border-sky-700 bg-sky-200/20 text-sky-800 font-semibold shadow-xs"
          : "border-slate-200 bg-white text-slate-600 hover:border-sky-700 hover:text-sky-700 hover:bg-sky-50/40"
      )}
      type="button"
    >
      {Icon && (
        <span className={cn("p-0.5 rounded transition-transform", isSelected ? "text-sky-700" : "text-slate-500")}>
          <Icon size={18} />
        </span>
      )}
      <span>{label}</span>
      {isSelected && (
        <span className="h-1.5 w-1.5 rounded-full bg-sky-700 ml-0.5"></span>
      )}
    </button>
  );
};