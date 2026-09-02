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
        "relative py-2 px-4 text-xs lg:text-sm font-semibold rounded-full flex items-center gap-x-2 whitespace-nowrap transition-all duration-150 select-none cursor-pointer border shrink-0",
        isSelected
          ? "border-slate-900 bg-slate-900 text-white font-bold shadow-sm"
          : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:border-slate-400"
      )}
      type="button"
    >
      {Icon && (
        <span className={cn(isSelected ? "text-purple-300" : "text-slate-500")}>
          <Icon size={16} />
        </span>
      )}
      <span>{label}</span>
    </button>
  );
};