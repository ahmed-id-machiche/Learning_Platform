"use client";

import { useEffect, useState } from "react";
import { BarChart, Bell, Bot, Compass, FileCheck, Layout, List, Megaphone, Sparkles, Users } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import axios from "axios";

const guestRoutes = [
  {
    icon: Layout,
    label: "Tableau de bord",
    href: "/",
  },
  {
    icon: Compass,
    label: "Catalogue & Modules",
    href: "/search",
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
    label: "Modules de Formation",
    href: "/teacher/courses",
  },
  {
    icon: Users,
    label: "Suivi des Étudiants",
    href: "/teacher/students",
  },
  {
    icon: FileCheck,
    label: "Corrections des TPs",
    href: "/teacher/submissions",
  },
  {
    icon: Megaphone,
    label: "Annonces Formateur",
    href: "/teacher/announcements",
  },
  {
    icon: BarChart,
    label: "Statistiques & Analytics",
    href: "/teacher/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const [announcementsCount, setAnnouncementsCount] = useState<number>(0);

  const isTeacherPage = pathname?.includes("/teacher");

  useEffect(() => {
    if (!isTeacherPage) {
      axios
        .get("/api/announcements")
        .then((res) => {
          if (Array.isArray(res.data)) {
            setAnnouncementsCount(res.data.length);
          }
        })
        .catch(() => {});
    }
  }, [isTeacherPage]);

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          badgeCount={route.href === "/announcements" ? announcementsCount : undefined}
        />
      ))}
    </div>
  );
};