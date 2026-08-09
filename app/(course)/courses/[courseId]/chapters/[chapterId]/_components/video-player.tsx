"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock, VideoOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  videoUrl?: string | null;
}

function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
    : null;
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
  videoUrl,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);
  const hasVideoSource = Boolean(playbackId || youtubeEmbedUrl || videoUrl);

  // Fallback safety timeout so spinner never hangs indefinitely
  useEffect(() => {
    if (!hasVideoSource) {
      setIsReady(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [hasVideoSource, playbackId, videoUrl]);

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );

        if (!nextChapterId) {
          confetti.onOpen();
          toast.success("Félicitations ! Vous avez terminé ce module.");
          router.refresh();
          router.push("/search");
        } else {
          toast.success("Progression enregistrée.");
          router.refresh();
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error("Erreur lors de la mise à jour de la progression.");
    }
  };

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-md">
      {/* Loading Spinner State */}
      {!isReady && !isLocked && hasVideoSource && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-10">
          <Loader2 className="h-8 w-8 animate-spin text-sky-400 mb-2" />
          <p className="text-xs font-semibold text-slate-400">Chargement de la vidéo du cours...</p>
        </div>
      )}

      {/* Locked State for Unpaid Students */}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-white p-6 text-center z-20">
          <div className="h-12 w-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 border border-amber-500/30">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Chapitre Réservé</h3>
          <p className="text-xs text-slate-300 max-w-md">
            Ce chapitre est verrouillé. Veuillez vous inscrire à ce module pour accéder à la vidéo et au contenu.
          </p>
        </div>
      )}

      {/* No Video Added Placeholder */}
      {!isLocked && !hasVideoSource && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
          <div className="h-12 w-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
            <VideoOff className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-200 mb-1">Aucune vidéo disponible pour ce chapitre</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Le formateur n'a pas encore ajouté de vidéo pour ce chapitre. Consultez les documents PDF ci-dessous.
          </p>
        </div>
      )}

      {/* Video Content Layer */}
      {!isLocked && hasVideoSource && (
        <>
          {youtubeEmbedUrl ? (
            <iframe
              src={youtubeEmbedUrl}
              title={title}
              onLoad={() => setIsReady(true)}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : playbackId ? (
            <MuxPlayer
              title={title}
              className={cn("w-full h-full", !isReady && "hidden")}
              onCanPlay={() => setIsReady(true)}
              onEnded={onEnd}
              autoPlay
              playbackId={playbackId}
            />
          ) : videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              onEnded={onEnd}
              onCanPlay={() => setIsReady(true)}
              onLoadedData={() => setIsReady(true)}
              className="w-full h-full object-cover"
            />
          ) : null}
        </>
      )}
    </div>
  );
};