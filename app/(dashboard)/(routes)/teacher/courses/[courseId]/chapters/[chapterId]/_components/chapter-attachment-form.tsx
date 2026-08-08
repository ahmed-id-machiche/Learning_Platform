"use client";

import * as z from "zod";
import axios from "axios";
import { File, Loader2, PlusCircle, X, FileText } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface ChapterAttachmentFormProps {
  initialData: { attachments: Attachment[] };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string().optional(),
  type: z.enum(["COURSE_PDF", "TP_SUJET", "TP_CORRIGE", "EFM_EXAM", "OTHER"]).default("COURSE_PDF"),
});

export const ChapterAttachmentForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterAttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/attachments`,
        values
      );
      toast.success("Document du chapitre ajouté");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/attachments/${id}`
      );
      toast.success("Document supprimé");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100/90 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between font-bold text-slate-800 text-xs uppercase tracking-wider">
        <span>Documents PDF & Supports du Chapitre</span>
        <Button onClick={toggleEdit} variant="ghost" size="sm" className="h-8 text-sky-700 hover:text-sky-800 font-bold">
          {isEditing ? (
            "Fermer"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Ajouter un PDF
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-xs text-slate-500 italic">
              Aucun document PDF spécifique attaché à ce chapitre.
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-white border border-slate-200 text-sky-800 rounded-lg shadow-2xs hover:border-sky-300 transition"
                >
                  <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-sky-700" />
                  <p className="text-xs font-semibold line-clamp-1 flex-1 text-slate-800">
                    {attachment.name}
                  </p>
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-200 ml-2">
                    PDF Chapitre
                  </span>
                  {deletingId === attachment.id ? (
                    <div className="ml-auto pl-2">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                    </div>
                  ) : (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto pl-2 text-slate-400 hover:text-rose-600 transition"
                      title="Supprimer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div className="space-y-3 bg-white p-3 rounded-lg border border-slate-200">
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url, name) => {
              if (url) {
                onSubmit({ url: url, name: name, type: "COURSE_PDF" });
              }
            }}
          />
          <p className="text-[11px] text-slate-500 italic">
            Téléchargez le polycopié de cours, le résumé PDF ou les exercices propres à ce chapitre.
          </p>
        </div>
      )}
    </div>
  );
};
