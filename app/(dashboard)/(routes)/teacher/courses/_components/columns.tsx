"use client";

import { useState } from "react";
import { Course } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { cn } from "@/lib/utils";

const CourseActionsCell = ({ id }: { id: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/courses/${id}`);
      toast.success("Module supprimé avec succès");
      router.refresh();
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression du module.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-x-2">
      <Link href={`/teacher/courses/${id}`}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition"
          title="Modifier le module"
        >
          <span className="sr-only">Modifier</span>
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>

      <ConfirmModal onConfirm={onDelete}>
        <Button
          variant="ghost"
          size="sm"
          disabled={isLoading}
          className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
          title="Supprimer le module"
        >
          <span className="sr-only">Supprimer</span>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Intitulé du Module
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "moduleCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code Module
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const code = row.getValue("moduleCode") as string;
      return (
        <span className="font-mono text-xs font-semibold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-md border border-emerald-200">
          {code || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "isFree",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Accès
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          Accès Gratuit OFPPT
        </span>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Statut
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;

      return (
        <Badge className={cn("bg-slate-500 text-white", isPublished && "bg-sky-700 text-white")}>
          {isPublished ? "Publié" : "Brouillon"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-4 font-semibold text-slate-700">Actions</div>,
    cell: ({ row }) => {
      const { id } = row.original;
      return <CourseActionsCell id={id} />;
    },
  },
];