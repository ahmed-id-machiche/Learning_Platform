"use client";

import axios from "axios";
import { Copy, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    const notification = toast.loading("Veuillez patienter...");
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Module dépublié", {
          id: notification,
        });
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Module publié avec succès !", {
          id: notification,
        });
        confetti.onOpen();
      }

      router.refresh();
    } catch {
      toast.error("Une erreur est survenue lors de la publication", {
        id: notification,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDuplicate = async () => {
    const notification = toast.loading("Duplication du module en cours...");
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/duplicate`);
      toast.success("Module cloné avec succès !", {
        id: notification,
      });
      router.push(`/teacher/courses/${response.data.id}`);
      router.refresh();
    } catch {
      toast.error("Erreur lors de la duplication du module", {
        id: notification,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    const notification = toast.loading("Veuillez patienter...");
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);

      toast.success("Module supprimé avec succès", {
        id: notification,
      });
      router.refresh();
      router.push(`/teacher/courses`);
    } catch {
      toast.error("Une erreur est survenue", {
        id: notification,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onDuplicate}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="flex items-center gap-x-1.5 border-slate-300"
      >
        <Copy className="h-4 w-4 text-slate-600" />
        <span>Cloner ce module</span>
      </Button>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Dépublier" : "Publier le module"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading} variant="destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};