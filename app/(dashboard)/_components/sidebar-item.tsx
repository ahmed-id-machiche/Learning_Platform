"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  badgeCount?: number;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  badgeCount,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all duration-200 hover:text-slate-700 hover:bg-slate-100 relative w-full group",
        isActive && "text-sky-700 bg-sky-50 font-semibold hover:bg-sky-50 hover:text-sky-700"
      )}
    >
      <div className="flex items-center gap-x-2.5 py-4 w-full">
        <Icon
          size={21}
          className={cn(
            "text-slate-400 transition-colors group-hover:text-slate-600",
            isActive && "text-sky-700 group-hover:text-sky-700"
          )}
        />
        <span className="truncate">{label}</span>
        {badgeCount !== undefined && badgeCount > 0 && (
          <span className="ml-auto mr-5 relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs shrink-0">
              {badgeCount}
            </span>
          </span>
        )}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all duration-200 absolute right-0 top-0 bottom-0 rounded-l-md",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};