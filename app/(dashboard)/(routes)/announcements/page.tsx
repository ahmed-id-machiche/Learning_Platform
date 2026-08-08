import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Bell, Pin, Sparkles, BookOpen, Calendar, UserCheck, Volume2 } from "lucide-react";
import { Suspense } from "react";
import { db } from "@/lib/db";
import Link from "next/link";

import { AnnouncementFilters } from "./_components/announcement-filters";
import { AnnouncementList } from "./_components/announcement-list";

interface StudentAnnouncementsPageProps {
  searchParams: Promise<{
    title?: string;
    pinned?: string;
    courseId?: string;
  }>;
}

export default async function StudentAnnouncementsPage({
  searchParams,
}: StudentAnnouncementsPageProps) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { title, pinned, courseId } = await searchParams;

  // Query announcements with search & filter conditions
  const announcements = await db.announcement.findMany({
    where: {
      ...(pinned === "true" ? { isPinned: true } : {}),
      ...(courseId ? { courseId } : {}),
      ...(title
        ? {
            OR: [
              { title: { contains: title, mode: "insensitive" } },
              { content: { contains: title, mode: "insensitive" } },
              { course: { title: { contains: title, mode: "insensitive" } } },
              { course: { moduleCode: { contains: title, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          moduleCode: true,
          filiere: true,
        },
      },
    },
    orderBy: [
      { isPinned: "desc" },
      { createdAt: "desc" },
    ],
  });

  // Fetch published courses for course selector
  const courses = await db.course.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      moduleCode: true,
    },
    orderBy: { title: "asc" },
  });

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-8 md:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
            <Volume2 className="h-3.5 w-3.5 text-sky-200" />
            <span>Actualités & Communiqués Formateurs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Annonces & Notifications OFPPT
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Restez informé des dates d'EFMs, des remises de travaux pratiques (TPs), des changements d'emploi du temps et des consignes pédagogiques de vos formateurs.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Suspense fallback={null}>
        <AnnouncementFilters courses={courses} />
      </Suspense>

      {/* Announcements List Stream with Mark as Read controls */}
      <AnnouncementList initialItems={announcements} />
    </div>
  );
}

