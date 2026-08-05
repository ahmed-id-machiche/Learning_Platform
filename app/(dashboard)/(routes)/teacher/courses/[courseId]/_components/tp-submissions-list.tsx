"use client";

import axios from "axios";
import { FileCheck, Download, Save, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubmissionItem {
  id: string;
  userId: string;
  chapterId: string;
  fileName: string;
  fileUrl: string;
  grade: string | null;
  comment: string | null;
  createdAt: Date;
  chapterTitle?: string;
}

interface TpSubmissionsListProps {
  courseId: string;
  submissions: SubmissionItem[];
  chaptersMap: Record<string, string>;
}

export const TpSubmissionsList = ({
  courseId,
  submissions,
  chaptersMap,
}: TpSubmissionsListProps) => {
  const router = useRouter();
  const [grades, setGrades] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    submissions.forEach((s) => {
      initial[s.id] = s.grade || "";
    });
    return initial;
  });
  const [savingId, setSavingId] = useState<string | null>(null);

  const onSaveGrade = async (submissionId: string) => {
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

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between mb-3">
        <div className="flex items-center gap-x-2">
          <FileCheck className="h-5 w-5 text-emerald-600" />
          <span>Rendus des Étudiants & Devoirs TP ({submissions.length})</span>
        </div>
      </div>

      {submissions.length === 0 && (
        <p className="text-sm text-slate-500 italic">
          Aucun TP soumis pour le moment par les étudiants.
        </p>
      )}

      {submissions.length > 0 && (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-x-2">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {chaptersMap[sub.chapterId] || "Chapitre"}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Stagiaire: {sub.userId.substring(0, 12)}...
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800 mt-1 truncate">
                  Fichier: {sub.fileName}
                </p>
                <a
                  href={sub.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-x-1 text-xs text-blue-600 hover:underline font-medium mt-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  Télécharger le TP
                </a>
              </div>

              <div className="flex items-center gap-x-2">
                <Input
                  placeholder="Note (ex: 18/20)"
                  value={grades[sub.id] || ""}
                  onChange={(e) =>
                    setGrades((prev) => ({ ...prev, [sub.id]: e.target.value }))
                  }
                  className="w-28 text-xs h-8 bg-slate-50"
                />
                <Button
                  onClick={() => onSaveGrade(sub.id)}
                  disabled={savingId === sub.id}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs bg-emerald-600 text-white hover:bg-emerald-700 border-none flex items-center gap-x-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
