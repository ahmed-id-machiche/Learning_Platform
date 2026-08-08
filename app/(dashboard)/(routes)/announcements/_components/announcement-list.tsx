"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Pin, BookOpen, Calendar, UserCheck, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: Date | string;
  course?: {
    id: string;
    title: string;
    moduleCode: string | null;
    filiere: string | null;
  } | null;
}

interface AnnouncementListProps {
  initialItems: AnnouncementItem[];
}

export const AnnouncementList = ({ initialItems }: AnnouncementListProps) => {
  const [readIds, setReadIds] = useState<string[]>([]);
  const [showRead, setShowRead] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load read IDs from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("ofppt_read_announcements");
      if (stored) {
        setReadIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
  }, []);

  const handleMarkAsRead = (id: string) => {
    const updated = Array.from(new Set([...readIds, id]));
    setReadIds(updated);
    try {
      localStorage.setItem("ofppt_read_announcements", JSON.stringify(updated));
      // Dispatch custom event to notify TopNavLinks & Sidebar to update badge count instantly
      window.dispatchEvent(new Event("announcements-read-updated"));
    } catch (e) {
      console.error("Error saving localStorage", e);
    }
  };

  const handleMarkAsUnread = (id: string) => {
    const updated = readIds.filter((item) => item !== id);
    setReadIds(updated);
    try {
      localStorage.setItem("ofppt_read_announcements", JSON.stringify(updated));
      window.dispatchEvent(new Event("announcements-read-updated"));
    } catch (e) {
      console.error("Error saving localStorage", e);
    }
  };

  // Filter items based on read status
  const visibleItems = initialItems.filter((item) => {
    const isRead = readIds.includes(item.id);
    if (showRead) return true; // show all
    return !isRead; // hide read announcements by default
  });

  const unreadCount = initialItems.filter((item) => !readIds.includes(item.id)).length;

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Top Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Bell className="h-5 w-5 text-sky-700" />
          Annonces Récentes ({unreadCount} non {unreadCount === 1 ? "lue" : "lues"})
        </h2>

        {readIds.length > 0 && (
          <button
            onClick={() => setShowRead(!showRead)}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1.5 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 transition"
          >
            {showRead ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                Masquer les annonces lues ({readIds.length})
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                Afficher l'historique des annonces lues ({readIds.length})
              </>
            )}
          </button>
        )}
      </div>

      {/* Announcements Stream */}
      {visibleItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
          <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-200 text-emerald-600">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {unreadCount === 0 && initialItems.length > 0
              ? "Vous êtes à jour ! Toutes les annonces ont été lues."
              : "Aucune annonce disponible pour ces filtres"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            {unreadCount === 0 && initialItems.length > 0
              ? "Cliquez sur 'Afficher l'historique' pour relire vos anciennes annonces."
              : "Vos formateurs n'ont pas encore publié de nouveau communiqué."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {visibleItems.map((announcement) => {
            const isRead = readIds.includes(announcement.id);

            return (
              <div
                key={announcement.id}
                className={`relative rounded-2xl bg-white p-6 border transition-all duration-300 shadow-xs hover:shadow-md ${
                  isRead
                    ? "opacity-60 bg-slate-50/80 border-slate-200"
                    : announcement.isPinned
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

                    {isRead && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                        Lue
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

                {/* Footer metadata & Mark as Read Action Button */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <UserCheck className="h-3.5 w-3.5 text-sky-700" />
                    <span>Publié par le Formateur</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {announcement.course && (
                      <Link
                        href={`/courses/${announcement.course.id}`}
                        className="text-sky-700 font-semibold hover:underline mr-2"
                      >
                        Consulter le module →
                      </Link>
                    )}

                    {/* DISMISS / MARK AS READ BUTTON */}
                    {!isRead ? (
                      <Button
                        onClick={() => handleMarkAsRead(announcement.id)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-xs text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>J'ai lu (Masquer la notification)</span>
                      </Button>
                    ) : (
                      <button
                        onClick={() => handleMarkAsUnread(announcement.id)}
                        className="text-slate-400 hover:text-slate-600 text-xs font-medium underline"
                      >
                        Marquer comme non lu
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
