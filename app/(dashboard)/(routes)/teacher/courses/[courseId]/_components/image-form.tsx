"use client";

import * as z from "zod";
import axios from "axios";
import { ImageIcon, Pencil, PlusCircle, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { OFPPT_FILIERES } from "@/lib/ofppt-constants";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "L'image est requise",
  }),
});

export const ImageForm = ({
  initialData,
  courseId,
}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Image du module mise à jour !");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Une erreur s'est produite lors de la mise à jour");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100/90 rounded-2xl p-5 font-sans space-y-3">
      <div className="font-extrabold text-sm text-slate-800 flex items-center justify-between">
        <span>Image d'illustration du module :</span>
        <Button onClick={toggleEdit} variant="ghost" size="sm" className="text-xs font-bold text-purple-700 hover:text-purple-900 rounded-xl">
          {isEditing && <>Annuler</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Ajouter une image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-1.5" />
              Changer l'image
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-48 bg-slate-200/80 rounded-2xl border-2 border-dashed border-slate-300 mt-2">
            <ImageIcon className="h-10 w-10 text-slate-400" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <Image
              alt="Couverture du module"
              fill
              unoptimized
              className="object-cover"
              src={initialData.imageUrl}
            />
          </div>
        )
      )}

      {isEditing && (
        <div className="mt-3 space-y-5">
          {/* Quick Selection Gallery for Pre-generated Filière Images */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
              Choix rapide - Cartes des Filières OFPPT :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {OFPPT_FILIERES.map((filiere) => {
                const isSelected = initialData.imageUrl === filiere.imageUrl;
                return (
                  <button
                    key={filiere.value}
                    type="button"
                    onClick={() => {
                      if (filiere.imageUrl) {
                        onSubmit({ imageUrl: filiere.imageUrl });
                      }
                    }}
                    className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-purple-700 ring-2 ring-purple-500/30 shadow-md"
                        : "border-slate-200 hover:border-purple-400"
                    }`}
                  >
                    <Image
                      src={filiere.imageUrl || "/images/filiere-courses/tsge-1ere-annee.jpg"}
                      alt={filiere.shortName}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex flex-col justify-between p-1.5">
                      <span className="text-[9px] font-black text-white bg-slate-900/80 px-1.5 py-0.5 rounded-md truncate max-w-full">
                        {filiere.shortName}
                      </span>
                      {isSelected && (
                        <div className="self-end bg-purple-700 text-white rounded-full p-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Or Upload Custom Image */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
              Ou Téléverser une image personnalisée :
            </label>
            <FileUpload
              endpoint="courseImage"
              onChange={(url) => {
                if (url) {
                  onSubmit({ imageUrl: url });
                }
              }}
            />
            <div className="text-[11px] text-slate-500 font-medium">
              Format 16:9 recommandé (JPG or PNG)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
