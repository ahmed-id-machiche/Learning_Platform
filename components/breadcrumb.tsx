"use client";

import { ChevronRight, Home, Compass, FileCheck, List, BookOpen } from "lucide-react";
import Link from "next/link";

export type BreadcrumbIconType = "compass" | "fileCheck" | "list" | "bookOpen";

const ICON_MAP: Record<BreadcrumbIconType, React.ComponentType<{ className?: string }>> = {
  compass: Compass,
  fileCheck: FileCheck,
  list: List,
  bookOpen: BookOpen,
};

export interface BreadcrumbItem {
  label: string;
  href?: string;
  iconName?: BreadcrumbIconType;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium py-2 px-3 rounded-lg bg-slate-100/70 border border-slate-200/60 w-fit backdrop-blur-xs">
      <Link
        href="/"
        className="flex items-center gap-x-1 text-slate-600 hover:text-sky-700 transition font-semibold"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Accueil</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.iconName ? ICON_MAP[item.iconName] : null;

        return (
          <div key={index} className="flex items-center space-x-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {isLast || !item.href ? (
              <span className="flex items-center gap-x-1 text-slate-900 font-bold truncate max-w-[200px] sm:max-w-[300px]">
                {Icon && <Icon className="h-3.5 w-3.5 text-sky-700 shrink-0" />}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="flex items-center gap-x-1 text-slate-600 hover:text-sky-700 transition font-medium truncate max-w-[180px]"
              >
                {Icon && <Icon className="h-3.5 w-3.5 text-slate-500 shrink-0" />}
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
