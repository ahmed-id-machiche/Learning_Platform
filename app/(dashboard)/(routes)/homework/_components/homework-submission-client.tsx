"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FileCheck,
  UploadCloud,
  CheckCircle2,
  BookOpen,
  Calendar,
  FileText,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/file-upload";
import { PdfDownloadButton } from "@/components/pdf-download-button";

interface CourseItem {
  id: string;
  title: string;
  moduleCode: string | null;
}

interface SubmissionItem {
  id: string;
  courseId: string;
  courseTitle: string;
  fileName: string;
  fileUrl: string;
  comment?: string | null;
  grade?: string | null;
  createdAt: Date | string;
}

interface HomeworkSubmissionClientProps {
  courses: CourseItem[];
  submissions: SubmissionItem[];
}

export const HomeworkSubmissionClient = ({
  courses,
  submissions,
}: HomeworkSubmissionClientProps) => {
  const router = useRouter();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "");
  const [comment, setComment] = useState<string>("");
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmitHomework = async () => {
    if (!selectedCourseId) {
      toast.error("Veuillez sélectionner un module.");
      return;
    }

    if (!uploadedUrl) {
      toast.error("Veuillez télécharger le fichier PDF de votre devoir.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post("/api/homework", {
        courseId: selectedCourseId,
        fileUrl: uploadedUrl,
        fileName: uploadedFileName || "Devoir_Etudiant.pdf",
        comment,
      });

      toast.success("Votre devoir PDF a été transmis avec succès au formateur !");
      setUploadedUrl("");
      setUploadedFileName("");
      setComment("");
      setShowForm(false);
      router.refresh();
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi du devoir.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Homework Action Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-sky-700" />
              Soumettre un Devoir PDF
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sélectionnez votre module et téléchargez le fichier de votre devoir au format PDF.
            </p>
          </div>

          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold px-4 py-2 rounded-xl shadow-xs text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            {showForm ? "Fermer le formulaire" : "+ Nouveau Devoir PDF"}
          </Button>
        </div>

        {/* Upload Form Box */}
        {showForm && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 bg-slate-50/60 p-5 rounded-xl border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select Module */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  1. Sélectionner le Module :
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="">-- Choisir un module --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.moduleCode ? `[${course.moduleCode}] ` : ""}{course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Note / Comment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  2. Remarque ou titre du devoir (Optionnel) :
                </label>
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ex: Devoir N°1 - Exercices de Logistique"
                  className="h-10 text-xs rounded-xl bg-white border-slate-200"
                />
              </div>
            </div>

            {/* PDF Upload */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                3. Fichier du Devoir (Format PDF) :
              </label>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <FileUpload
                  endpoint="courseAttachment"
                  onChange={(url, name) => {
                    if (url) {
                      setUploadedUrl(url);
                      setUploadedFileName(name || "Devoir.pdf");
                      toast.success("Fichier PDF chargé ! Cliquez sur 'Envoyer au formateur'.");
                    }
                  }}
                />
              </div>
              {uploadedFileName && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Fichier sélectionné : <strong>{uploadedFileName}</strong></span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <Button
                onClick={handleSubmitHomework}
                disabled={isSubmitting || !uploadedUrl || !selectedCourseId}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <FileCheck className="h-4 w-4" />
                <span>Envoyer mon devoir au formateur</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Submissions Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-sky-700" />
            Mes Devoirs Transmis ({submissions.length})
          </h3>
        </div>

        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
            <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-200 text-slate-400">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h4 className="text-base font-bold text-slate-800">
              Aucun devoir transmis pour le moment
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Cliquez sur le bouton <strong>"+ Nouveau Devoir PDF"</strong> ci-dessus pour envoyer votre premier travail pratique au formateur.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-sky-100 text-sky-800 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg border border-sky-200">
                      {sub.courseTitle}
                    </span>

                    {sub.grade ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        Note : {sub.grade}
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-800 text-[11px] font-medium px-2.5 py-0.5 rounded-lg border border-amber-200">
                        En attente de correction
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 line-clamp-1">
                    {sub.fileName}
                  </h4>

                  {sub.comment && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                      "{sub.comment}"
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(sub.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Fichier PDF
                  </span>
                  <PdfDownloadButton url={sub.fileUrl} name={sub.fileName} variant="card" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
