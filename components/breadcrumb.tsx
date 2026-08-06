"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
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
        const Icon = item.icon;

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
