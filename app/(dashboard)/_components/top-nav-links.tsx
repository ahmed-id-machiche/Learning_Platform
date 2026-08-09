"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  BarChart,
  Bell,
  Compass,
  FileCheck,
  Layout,
  List,
  Megaphone,
  Users,
} from "lucide-react";

const guestRoutes = [
  {
    icon: Compass,
    label: "Catalogue & Modules",
    href: "/search",
  },
  {
    icon: Layout,
    label: "Tableau de bord",
    href: "/",
  },
  {
    icon: FileCheck,
    label: "Devoirs",
    href: "/homework",
  },
  {
    icon: FileCheck,
    label: "EFMs & TPs Corrigés",
    href: "/resources",
  },
  {
    icon: Bell,
    label: "Annonces OFPPT",
    href: "/announcements",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Modules",
    href: "/teacher/courses",
  },
  {
    icon: Users,
    label: "Étudiants",
    href: "/teacher/students",
  },
  {
    icon: FileCheck,
    label: "Devoirs",
    href: "/teacher/submissions",
  },
  {
    icon: Megaphone,
    label: "Annonces Formateur",
    href: "/teacher/announcements",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export const TopNavLinks = () => {
  const pathname = usePathname();
  const [announcementsCount, setAnnouncementsCount] = useState<number>(0);

  const isTeacherPage = pathname?.includes("/teacher");

  const fetchUnreadCount = () => {
    if (isTeacherPage) return;

    axios
      .get("/api/announcements")
      .then((res) => {
        if (Array.isArray(res.data)) {
          let readIds: string[] = [];
          try {
            const stored = localStorage.getItem("ofppt_read_announcements");
            if (stored) readIds = JSON.parse(stored);
          } catch (e) {}

          const unread = res.data.filter((item: any) => !readIds.includes(item.id)).length;
          setAnnouncementsCount(unread);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUnreadCount();

    const handleUpdate = () => fetchUnreadCount();
    window.addEventListener("announcements-read-updated", handleUpdate);
    return () => window.removeEventListener("announcements-read-updated", handleUpdate);
  }, [isTeacherPage]);

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <nav className="flex items-center gap-x-1 lg:gap-x-2">
      {routes.map((route) => {
        const Icon = route.icon;
        const isActive =
          (pathname === "/" && route.href === "/") ||
          pathname === route.href ||
          (route.href !== "/" && pathname?.startsWith(route.href));

        const badgeCount = route.href === "/announcements" ? announcementsCount : undefined;

        return (
          <Link
            key={route.href}
            href={route.href}
            className={`relative flex items-center gap-x-2 px-3.5 py-2 text-xs lg:text-sm font-bold rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-sky-50 text-sky-700 shadow-2xs border border-sky-200/90"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? "text-sky-700" : "text-slate-500"}`} />
            <span className="whitespace-nowrap">{route.label}</span>

            {badgeCount !== undefined && badgeCount > 0 && (
              <span className="inline-flex items-center justify-center h-4 min-w-4 px-1.5 text-[10px] font-extrabold text-white bg-rose-500 rounded-full shadow-xs animate-pulse">
                {badgeCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
