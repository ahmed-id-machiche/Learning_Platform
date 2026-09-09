"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const guestRoutes = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Devoirs",
    href: "/homework",
  },
  {
    label: "Documents",
    href: "/resources",
  },
  {
    label: "Notifications",
    href: "/announcements",
  },
];

const teacherRoutes = [
  {
    label: "Modules",
    href: "/teacher/courses",
  },
  {
    label: "Étudiants",
    href: "/teacher/students",
  },
  {
    label: "Devoirs",
    href: "/teacher/submissions",
  },
  {
    label: "Annonces",
    href: "/teacher/announcements",
  },
  {
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

export const TopNavLinks = () => {
  const pathname = usePathname();
  const [announcementsCount, setAnnouncementsCount] = useState<number>(0);
  const [pendingStudentsCount, setPendingStudentsCount] = useState<number>(0);

  const isTeacherPage = pathname?.includes("/teacher");

  const fetchCounts = () => {
    if (isTeacherPage) {
      axios
        .get("/api/students/pending-count")
        .then((res) => {
          if (typeof res.data?.count === "number") {
            setPendingStudentsCount(res.data.count);
          }
        })
        .catch(() => {});
    } else {
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
    }
  };

  useEffect(() => {
    fetchCounts();

    const handleUpdate = () => fetchCounts();
    window.addEventListener("announcements-read-updated", handleUpdate);
    return () => window.removeEventListener("announcements-read-updated", handleUpdate);
  }, [isTeacherPage]);

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <nav className="flex items-center gap-x-1 lg:gap-x-1.5">
      {routes.map((route) => {
        const isActive =
          (pathname === "/" && route.href === "/") ||
          pathname === route.href ||
          (route.href !== "/" && pathname?.startsWith(route.href));

        const badgeCount =
          route.href === "/announcements"
            ? announcementsCount
            : route.href === "/teacher/students"
            ? pendingStudentsCount
            : undefined;

        return (
          <Link
            key={route.href}
            href={route.href}
            className={`relative flex items-center px-3 py-2 text-xs lg:text-sm transition-all duration-150 rounded-lg ${
              isActive
                ? "text-purple-700 font-bold bg-purple-50/80 border border-purple-200/80"
                : "text-slate-700 font-medium hover:text-purple-700 hover:bg-purple-50/50"
            }`}
          >
            <span className="whitespace-nowrap">{route.label}</span>

            {badgeCount !== undefined && badgeCount > 0 && (
              <span className="inline-flex items-center justify-center h-4 min-w-4 px-1.5 text-[10px] font-extrabold text-white bg-amber-500 rounded-full shadow-xs animate-pulse ml-1.5">
                {badgeCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
