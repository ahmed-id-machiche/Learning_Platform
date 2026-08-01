"use client";

import * as z from "zod";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
  name: z.string().optional(),
  type: z.enum(["COURSE_PDF", "TP_SUJET", "TP_CORRIGE", "EFM_EXAM", "OTHER"]).default("OTHER"),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"COURSE_PDF" | "TP_SUJET" | "TP_CORRIGE" | "EFM_EXAM" | "OTHER">("COURSE_PDF");

  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Attachment added");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "COURSE_PDF":
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded ml-2">Cours PDF</span>;
      case "TP_SUJET":
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded ml-2">TP Sujet</span>;
      case "TP_CORRIGE":
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded ml-2">TP Corrigé</span>;
      case "EFM_EXAM":
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded ml-2">EFM Exam</span>;
      default:
        return <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded ml-2">Doc</span>;
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        OFPPT TPs, Exams & Course Documents
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No TPs or documents uploaded yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2 mt-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1 flex-1">{attachment.name}</p>
                  {getTypeBadge(attachment.type)}
                  {deletingId === attachment.id && (
                    <div className="ml-auto pl-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto pl-2 hover:opacity-75 transition"
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
        <div className="mt-2 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Select Document Category:
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
            >
              <option value="COURSE_PDF">Cours PDF / Support de Cours</option>
              <option value="TP_SUJET">TP - Sujet (Travaux Pratiques)</option>
              <option value="TP_CORRIGE">TP - Corrigé</option>
              <option value="EFM_EXAM">EFM / Exam Format</option>
              <option value="OTHER">Autre document</option>
            </select>
          </div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url, name) => {
              if (url) {
                onSubmit({ url: url, name: name, type: selectedType });
              }
            }}
          />
          <div className="text-xs text-muted-foreground">
            Upload TPs, Corrigés, or PDF Course slides for your OFPPT students.
          </div>
        </div>
      )}
    </div>
  );
};
