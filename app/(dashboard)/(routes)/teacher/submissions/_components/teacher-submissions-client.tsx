"use client";

import axios from "axios";
import { Download, FileCheck, Save, Search, CheckCircle2 } from "lucide-react";
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
  const [savingId, setSavingId] = useState<string | null>(null);

  const onSaveGrade = async (courseId: string, submissionId: string) => {
    try {
      setSavingId(submissionId);
      await axios.patch(`/api/courses/${courseId}/submissions/${submissionId}`, {
        grade: grades[submissionId],
      });
      toast.success("Note enregistrée avec succès!");
      router.refresh();
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSavingId(null);
    }
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
        <Search className="h-4 w-4 absolute top-3 left-3 text-slate-500" />
        <Input
          placeholder="Filtrer par nom d'étudiant, module, chapitre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 text-xs h-9 bg-white"
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
          {filteredSubmissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white border rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-slate-300"
            >
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded">
                    👤 {sub.studentName || "Étudiant"}
                  </span>
                  <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                    {sub.courseTitle}
                  </span>
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {sub.chapterTitle}
                  </span>
                </div>

                <div className="pt-1 flex items-center gap-x-2">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {sub.fileName}
                  </p>
                  <a
                    href={sub.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-x-1 text-xs text-blue-600 hover:underline font-semibold"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Télécharger
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-x-2 shrink-0">
                <Input
                  placeholder="Note (ex: 18/20)"
                  value={grades[sub.id] || ""}
                  onChange={(e) =>
                    setGrades((prev) => ({ ...prev, [sub.id]: e.target.value }))
                  }
                  className="w-32 text-xs h-9 bg-slate-50 font-medium"
                />
                <Button
                  onClick={() => onSaveGrade(sub.courseId, sub.id)}
                  disabled={savingId === sub.id}
                  size="sm"
                  className="h-9 text-xs bg-emerald-600 text-white hover:bg-emerald-700 font-medium flex items-center gap-x-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  {savingId === sub.id ? "Sauvegarde..." : "Attribuer note"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
