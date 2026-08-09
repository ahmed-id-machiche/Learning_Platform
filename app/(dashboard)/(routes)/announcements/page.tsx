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
    return redirect("/sign-in");
  }

  const { title, pinned, courseId } = await searchParams;

  const validTitle = title && title !== "undefined" && title !== "null" && title.trim() !== "" ? title.trim() : undefined;
  const validCourseId = courseId && courseId !== "undefined" && courseId !== "null" && courseId.trim() !== "" ? courseId : undefined;

  // Query announcements with search & filter conditions
  const announcements = await db.announcement.findMany({
    where: {
      ...(pinned === "true" ? { isPinned: true } : {}),
      ...(validCourseId ? { courseId: validCourseId } : {}),
      ...(validTitle
        ? {
            OR: [
              { title: { contains: validTitle, mode: "insensitive" } },
              { content: { contains: validTitle, mode: "insensitive" } },
              { course: { title: { contains: validTitle, mode: "insensitive" } } },
              { course: { moduleCode: { contains: validTitle, mode: "insensitive" } } },
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-8 text-white shadow-xl min-h-[170px] flex items-center">
        {/* Subtle ambient lighting glows */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Annonces & Notifications OFPPT
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed font-normal pt-1.5 max-w-2xl">
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

