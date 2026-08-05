"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Megaphone, Plus, Trash2, Pin, Calendar, BookOpen, Send, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  moduleCode?: string | null;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  course?: {
    id: string;
    title: string;
    moduleCode?: string | null;
  } | null;
}

export default function TeacherAnnouncementsPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [courseId, setCourseId] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [coursesRes, announcementsRes] = await Promise.all([
        axios.get("/api/courses"),
        axios.get("/api/announcements"),
      ]);
      setCourses(coursesRes.data || []);
      setAnnouncements(announcementsRes.data || []);
    } catch (error) {
      toast.error("Erreur de chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Veuillez remplir le titre et le contenu de l'annonce");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("/api/announcements", {
        title,
        content,
        courseId: courseId || null,
        isPinned,
      });

      toast.success("Annonce publiée avec succès !");
      setTitle("");
      setContent("");
      setCourseId("");
      setIsPinned(false);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la publication de l'annonce");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (announcementId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;

    try {
      await axios.delete(`/api/announcements/${announcementId}`);
      toast.success("Annonce supprimée avec succès");
      fetchData();
    } catch (error) {
      toast.error("Impossible de supprimer l'annonce");
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-[1400px] mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
            <Megaphone className="h-3.5 w-3.5 text-sky-200" />
            <span>Espace Formateur OFPPT</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Gestion des Annonces & Communiqués
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
            Publiez des messages importants pour vos étudiants : rappels d'EFMs, consignes de TPs ou informations générales.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Announcement Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-sky-700" />
              Nouvelle Annonce
            </h2>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Titre de l'annonce *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Date EFM Blanc - Module M102"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Module Cible (Optionnel)
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 bg-white transition"
                >
                  <option value="">Tous les étudiants (Annonce Générale)</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.moduleCode ? `[${course.moduleCode}] ` : ""}{course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message / Consignes *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="Rédigez le détail de votre communiqué aux étudiants..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition resize-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="isPinned" className="text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1">
                  <Pin className="h-3.5 w-3.5 text-amber-600" /> Épingler en haut de liste
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? "Publication..." : "Publier l'annonce"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Existing Announcements Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-sky-700" />
            Annonces Publiées ({announcements.length})
          </h2>

          {announcements.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-2">
              <p className="text-sm font-medium">Vous n'avez publié aucune annonce pour le moment.</p>
              <p className="text-xs text-slate-400">Utilisez le formulaire ci-contre pour publier un message.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative space-y-3 hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {announcement.isPinned && (
                        <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <Pin className="h-3 w-3 fill-amber-700" /> Épinglé
                        </span>
                      )}
                      {announcement.course ? (
                        <span className="bg-sky-50 text-sky-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-sky-100 flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-sky-700" />
                          {announcement.course.moduleCode || "Module"}: {announcement.course.title}
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                          Annonce Générale
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onDelete(announcement.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Supprimer l'annonce"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {announcement.title}
                  </h3>

                  <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                    {announcement.content}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
