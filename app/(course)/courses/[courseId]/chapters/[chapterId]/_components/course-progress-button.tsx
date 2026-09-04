"use client";

import axios from "axios";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
        toast.success("Félicitations ! Vous avez terminé ce module OFPPT ! 🎉");
        router.refresh();
        router.push("/");
      } else if (!isCompleted && nextChapterId) {
        toast.success("Cours validé ! Passage au chapitre suivant...");
        router.refresh();
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      } else {
        toast.success("Statut du cours mis à jour.");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur s'est produite lors de la sauvegarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      className={`w-full sm:w-auto font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 ${
        isCompleted
          ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
          : "bg-purple-700 hover:bg-purple-800 text-white"
      }`}
    >
      {isCompleted ? (
        <>
          <RotateCcw className="h-4 w-4 text-slate-500" />
          <span>Marquer comme non lu</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4" />
          <span>J'ai lu ce cours (Terminer)</span>
        </>
      )}
    </Button>
  );
};