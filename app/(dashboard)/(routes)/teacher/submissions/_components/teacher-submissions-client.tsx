"use client";

import axios from "axios";
import {
  Download,
  FileCheck,
  Save,
  Search,
  User,
  BookOpen,
  FileText,
  Pencil,
  Trash2,
  X,
  Award,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormattedSubmission {
  id: string;
  userId: string;
  courseId: string;
  chapterId: string;
  fileName: string;
  fileUrl: string;
  grade: string | null;
  comment: string | null;
  createdAt: Date;
  courseTitle: string;
  chapterTitle: string;
  studentName?: string;
  studentEmail?: string;
}

interface TeacherSubmissionsClientProps {
  submissions: FormattedSubmission[];
}

export const TeacherSubmissionsClient = ({
  submissions,
}: TeacherSubmissionsClientProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [grades, setGrades] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    submissions.forEach((s) => {
      initial[s.id] = s.grade || "";
    });
    return initial;
  });

  const [editingMap, setEditingMap] = useState<Record<string, boolean>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const onSaveGrade = async (courseId: string, submissionId: string) => {
    const newGrade = grades[submissionId];
    if (!newGrade || !newGrade.trim()) {
      toast.error("Veuillez saisir une note (ex: 18/20).");
      return;
    }

    try {
      setLoadingId(submissionId);
      await axios.patch(`/api/courses/${courseId}/submissions/${submissionId}`, {
        grade: newGrade,
      });
      toast.success("Note enregistrée avec succès !");
      setEditingMap((prev) => ({ ...prev, [submissionId]: false }));
      router.refresh();
    } catch {
      toast.error("Erreur lors de l'enregistrement de la note.");
    } finally {
      setLoadingId(null);
    }
  };

  const onDeleteGrade = async (courseId: string, submissionId: string) => {
    try {
      setLoadingId(submissionId);
      await axios.patch(`/api/courses/${courseId}/submissions/${submissionId}`, {
        grade: null,
      });
      toast.success("Note supprimée avec succès !");
      setGrades((prev) => ({ ...prev, [submissionId]: "" }));
      setEditingMap((prev) => ({ ...prev, [submissionId]: false }));
      router.refresh();
    } catch {
      toast.error("Erreur lors de la suppression de la note.");
    } finally {
      setLoadingId(null);
    }
  };

  const toggleEdit = (id: string, currentGrade: string | null) => {
    setGrades((prev) => ({ ...prev, [id]: currentGrade || "" }));
    setEditingMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredSubmissions = submissions.filter(
    (sub) =>
      (sub.studentName && sub.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sub.studentEmail && sub.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sub.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.chapterTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="h-4 w-4 absolute top-3 left-3 text-slate-400" />
        <Input
          placeholder="Filtrer par nom d'étudiant, module, chapitre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 text-xs h-10 bg-white border-slate-200 rounded-xl"
        />
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <FileCheck className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">Aucun devoir trouvé</h3>
          <p className="text-xs text-slate-500 mt-1">
            Les devoirs au format PDF soumis par vos étudiants apparaîtront ici.
          </p>
        </div>
      )}

      {filteredSubmissions.length > 0 && (
        <div className="space-y-3">
          {filteredSubmissions.map((sub) => {
            const isEditing = editingMap[sub.id];
            const hasGrade = Boolean(sub.grade && sub.grade.trim());

            return (
              <div
                key={sub.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-slate-300"
              >
                {/* Left details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-x-1.5 text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                      <User className="h-3.5 w-3.5 text-slate-600" />
                      {sub.studentName || "Stagiaire"}
                    </span>
                    <span className="inline-flex items-center gap-x-1 text-xs font-bold text-sky-900 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                      <BookOpen className="h-3.5 w-3.5 text-sky-700" />
                      {sub.courseTitle}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      {sub.chapterTitle}
                    </span>
                  </div>

                  <div className="pt-1 flex items-center gap-x-3">
                    <div className="flex items-center gap-x-1.5 text-xs font-semibold text-slate-800">
                      <FileText className="h-4 w-4 text-sky-700" />
                      <span>{sub.fileName}</span>
                    </div>
                    <a
                      href={sub.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-x-1 text-xs text-sky-700 hover:text-sky-900 hover:underline font-bold"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Télécharger PDF
                    </a>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-x-2 shrink-0">
                  {hasGrade && !isEditing ? (
                    // Display Saved Note + Edit & Delete Buttons
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-emerald-600" />
                        <span>Note : <strong>{sub.grade}</strong></span>
                      </div>

                      {/* Edit Button */}
                      <Button
                        onClick={() => toggleEdit(sub.id, sub.grade)}
                        disabled={loadingId === sub.id}
                        size="sm"
                        variant="outline"
                        className="h-9 text-xs border-slate-200 text-slate-700 hover:bg-slate-100 font-bold px-3 rounded-xl flex items-center gap-1 cursor-pointer"
                        title="Modifier la note"
                      >
                        <Pencil className="h-3.5 w-3.5 text-slate-600" />
                        <span>Modifier</span>
                      </Button>

                      {/* Delete Button */}
                      <Button
                        onClick={() => onDeleteGrade(sub.courseId, sub.id)}
                        disabled={loadingId === sub.id}
                        size="sm"
                        variant="outline"
                        className="h-9 text-xs border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 font-bold px-3 rounded-xl flex items-center gap-1 cursor-pointer"
                        title="Supprimer la note"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                        <span>Supprimer</span>
                      </Button>
                    </div>
                  ) : (
                    // Input Form for Adding or Editing Note
                    <div className="flex items-center gap-x-2">
                      <Input
                        placeholder="Note (ex: 18/20)"
                        value={grades[sub.id] || ""}
                        onChange={(e) =>
                          setGrades((prev) => ({ ...prev, [sub.id]: e.target.value }))
                        }
                        className="w-36 text-xs h-10 bg-slate-50 border-slate-200 font-semibold rounded-xl"
                      />

                      <Button
                        onClick={() => onSaveGrade(sub.courseId, sub.id)}
                        disabled={loadingId === sub.id}
                        size="sm"
                        className="h-10 text-xs bg-sky-700 text-white hover:bg-sky-800 font-bold px-4 rounded-xl flex items-center gap-x-1.5 cursor-pointer shadow-2xs"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {loadingId === sub.id ? "Sauvegarde..." : isEditing ? "Enregistrer" : "Attribuer note"}
                      </Button>

                      {isEditing && (
                        <Button
                          onClick={() => toggleEdit(sub.id, sub.grade)}
                          disabled={loadingId === sub.id}
                          size="sm"
                          variant="ghost"
                          className="h-10 text-xs text-slate-500 hover:text-slate-700 px-2 rounded-xl cursor-pointer"
                          title="Annuler"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
