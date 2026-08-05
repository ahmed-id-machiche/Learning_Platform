import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Bell, Pin, Sparkles, BookOpen, Calendar, UserCheck, Volume2 } from "lucide-react";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function StudentAnnouncementsPage() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const announcements = await db.announcement.findMany({
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

  return (
    <div className="p-6 space-y-8 max-w-[1400px] mx-auto pb-12">
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

      {/* Announcements List Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="h-5 w-5 text-sky-700" />
            Annonces Récentes ({announcements.length})
          </h2>
        </div>

        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
            <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-200 text-slate-400">
              <Bell className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Aucune annonce disponible
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Vos formateurs n'ont pas encore publié de communiqué. Les nouvelles annonces apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`relative rounded-2xl bg-white p-6 border transition-all duration-200 shadow-xs hover:shadow-md ${
                  announcement.isPinned
                    ? "border-sky-500/50 ring-1 ring-sky-500/20 bg-sky-50/20"
                    : "border-slate-200/80 hover:border-sky-300"
                }`}
              >
                {/* Header row with Pinned badge & Course Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {announcement.isPinned && (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                        <Pin className="h-3 w-3 fill-amber-700 text-amber-700" />
                        Épinglé
                      </span>
                    )}

                    {announcement.course ? (
                      <Link href={`/courses/${announcement.course.id}`}>
                        <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-sky-200 hover:bg-sky-200 transition">
                          <BookOpen className="h-3 w-3 text-sky-700" />
                          {announcement.course.moduleCode || "Module"}: {announcement.course.title}
                        </span>
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-slate-200">
                        Annonce Générale OFPPT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {new Date(announcement.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                  {announcement.title}
                </h3>

                {/* Content */}
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                  {announcement.content}
                </p>

                {/* Footer metadata */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <UserCheck className="h-3.5 w-3.5 text-sky-700" />
                    <span>Publié par le Formateur</span>
                  </div>
                  {announcement.course && (
                    <Link
                      href={`/courses/${announcement.course.id}`}
                      className="text-sky-700 font-semibold hover:underline"
                    >
                      Consulter le module →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
