"use client";

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { Pencil, PlusCircle, Video, Link2, Upload, PlayCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "youtube">("upload");
  const [youtubeInput, setYoutubeInput] = useState(initialData.videoUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Vidéo du chapitre mise à jour !");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Erreur lors de la mise à jour de la vidéo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeInput.trim()) {
      toast.error("Veuillez saisir un lien YouTube valide.");
      return;
    }
    onSubmit({ videoUrl: youtubeInput.trim() });
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(initialData.videoUrl);

  return (
    <div className="mt-6 border border-slate-200 bg-slate-50/70 rounded-2xl p-4 shadow-xs">
      <div className="font-bold text-sm text-slate-800 flex items-center justify-between">
        Vidéo du Chapitre
        <Button
          onClick={toggleEdit}
          variant="ghost"
          className="text-xs font-semibold hover:bg-slate-200/60 rounded-xl"
        >
          {isEditing && <>Annuler</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
              Ajouter une vidéo
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Modifier la vidéo
            </>
          )}
        </Button>
      </div>

      {/* Video Preview Mode */}
      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex flex-col items-center justify-center h-52 bg-slate-200/80 rounded-xl mt-3 text-slate-500 gap-y-2">
            <Video className="h-10 w-10 text-slate-400" />
            <p className="text-xs font-medium">Aucune vidéo associée à ce chapitre</p>
          </div>
        ) : (
          <div className="relative aspect-video mt-3 rounded-xl overflow-hidden bg-slate-900 shadow-xs border border-slate-200">
            {youtubeEmbedUrl ? (
              <iframe
                src={youtubeEmbedUrl}
                title={initialData.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : initialData?.muxData?.playbackId ? (
              <MuxPlayer playbackId={initialData.muxData.playbackId} />
            ) : (
              <video
                src={initialData.videoUrl}
                controls
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )
      )}

      {/* Video Edit Mode: Choice Tabs (Upload vs YouTube) */}
      {isEditing && (
        <div className="mt-3 space-y-4">
          <div className="flex items-center gap-x-2 border-b pb-2">
            <Button
              type="button"
              variant={activeTab === "upload" ? "default" : "outline"}
              onClick={() => setActiveTab("upload")}
              className={`h-8 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer ${
                activeTab === "upload" ? "bg-sky-700 hover:bg-sky-800 text-white" : "text-slate-600"
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              Téléverser depuis le PC
            </Button>
            <Button
              type="button"
              variant={activeTab === "youtube" ? "default" : "outline"}
              onClick={() => setActiveTab("youtube")}
              className={`h-8 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer ${
                activeTab === "youtube" ? "bg-rose-600 hover:bg-rose-700 text-white" : "text-slate-600"
              }`}
            >
              <PlayCircle className="h-3.5 w-3.5" />
              Lien YouTube / Externe
            </Button>
          </div>

          {activeTab === "upload" && (
            <div>
              <FileUpload
                endpoint="chapterVideo"
                onChange={(url) => {
                  if (url) {
                    onSubmit({ videoUrl: url });
                  }
                }}
              />
              <div className="text-[11px] text-slate-500 mt-2">
                Sélectionnez ou glissez-déposez un fichier vidéo MP4/WebM depuis votre ordinateur.
              </div>
            </div>
          )}

          {activeTab === "youtube" && (
            <form onSubmit={onYoutubeSubmit} className="space-y-3">
              <div className="relative">
                <Link2 className="h-4 w-4 absolute top-3 left-3 text-slate-400" />
                <Input
                  placeholder="Collez le lien YouTube (ex: https://www.youtube.com/watch?v=...)"
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  disabled={isSubmitting}
                  className="pl-9 text-xs h-10 bg-white border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex items-center gap-x-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !youtubeInput.trim()}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl h-9 px-4 cursor-pointer"
                >
                  Enregistrer le lien YouTube
                </Button>
              </div>
              <div className="text-[11px] text-slate-500">
                Vous pouvez utiliser des vidéos publiques ou non répertoriées (Unlisted) de YouTube.
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};