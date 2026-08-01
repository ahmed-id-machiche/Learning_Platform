"use client";

import axios from "axios";
import { FileCheck, UploadCloud, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface TpSubmissionFormProps {
  courseId: string;
  chapterId: string;
  initialSubmission?: {
    id: string;
    fileUrl: string;
    fileName: string;
    comment?: string | null;
    grade?: string | null;
  } | null;
}

export const TpSubmissionForm = ({
  courseId,
  chapterId,
  initialSubmission,
}: TpSubmissionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [submission, setSubmission] = useState(initialSubmission);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (url: string, name?: string) => {
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/submission`,
        {
          fileUrl: url,
          fileName: name || "TP_Rendu",
        }
      );
      setSubmission(response.data);
      toast.success("TP rendu avec succès!");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Erreur lors de l'envoi du TP");
    }
  };

  return (
    <div className="mt-6 border bg-emerald-50/60 border-emerald-200 rounded-xl p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2 text-emerald-900 font-bold text-base sm:text-lg">
          <FileCheck className="h-5 w-5 text-emerald-600" />
          <span>Dépôt de TP (Travaux Pratiques)</span>
        </div>
        <Button onClick={toggleEdit} variant="outline" size="sm" className="bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-800 font-medium">
          {isEditing ? "Annuler" : submission ? "Modifier le rendu" : "Déposer mon TP"}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-3">
          {submission ? (
            <div className="space-y-3">
              <div className="flex items-center p-3 w-full bg-white border border-emerald-200 text-emerald-800 rounded-lg shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-2 flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold truncate">{submission.fileName}</p>
                  <a
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-600 hover:underline block truncate"
                  >
                    Voir mon fichier rendu
                  </a>
                </div>
                {submission.grade && (
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300 ml-2">
                    Note: {submission.grade}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-600 italic">
              Vous n'avez pas encore déposé de travail pour ce module. Cliquez sur "Déposer mon TP" pour envoyer votre solution.
            </p>
          )}
        </div>
      )}

      {isEditing && (
        <div className="mt-4 bg-white p-4 rounded-lg border border-emerald-200 shadow-inner space-y-3">
          <label className="text-xs font-semibold text-slate-700 block">
            Téléchargez le fichier de votre TP (ZIP, PDF, Code, ou Image):
          </label>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url, name) => {
              if (url) {
                onSubmit(url, name);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
