"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

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
          toast.success("Course completed! Redirecting to course catalog...");
          router.refresh();
          router.push("/search");
        } else {
          toast.success("Progress updated");
          router.refresh();
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm font-medium">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <>
          {playbackId ? (
            <MuxPlayer
              title={title}
              className={cn(!isReady && "hidden")}
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
              className="w-full h-full rounded-md object-cover"
            />
          ) : null}
        </>
      )}
    </div>
  );
};