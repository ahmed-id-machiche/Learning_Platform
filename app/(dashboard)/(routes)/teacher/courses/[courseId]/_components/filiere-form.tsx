"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FiliereFormProps {
  initialData: {
    filiere: string | null;
  };
  courseId: string;
}

const filiereOptions = [
  "Développement Digital (DD)",
  "Infrastructure Digitale (ID)",
  "Gestion des Entreprises (GE)",
  "Finance & Comptabilité",
  "Commerce International & Logistique",
  "Génie Civil & BTP",
  "Génie Électrique & Électromécanique",
  "Génie Mécanique & Automotion",
  "Tronc Commun Digital (TS 1ère Année)",
  "Tronc Commun Gestion (TS 1ère Année)",
  "Secrétariat, Bureautique & Communication",
  "Autre Filière Spécialisée OFPPT",
];

const formSchema = z.object({
  filiere: z.string().min(1, {
    message: "La filière est requise",
  }),
});

export const FiliereForm = ({
  initialData,
  courseId,
}: FiliereFormProps) => {
  const [isCustom, setIsCustom] = useState(
    !!initialData.filiere && !filiereOptions.includes(initialData.filiere)
  );
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filiere: initialData.filiere || "",
    },
  });

  const { isSubmitting, isDirty, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Filière du module mise à jour");
      form.reset(values);
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const handleSelectChange = (val: string) => {
    if (val === "Autre Filière Spécialisée OFPPT") {
      setIsCustom(true);
      form.setValue("filiere", "", { shouldDirty: true });
    } else {
      setIsCustom(false);
      form.setValue("filiere", val, { shouldDirty: true });
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="mt-6 border bg-slate-100/90 rounded-xl p-4 space-y-3">
      <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
        Filière / Spécialité OFPPT :
      </label>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="filiere"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {!isCustom ? (
                    <select
                      disabled={isSubmitting}
                      className="w-full h-10 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-xs"
                      value={filiereOptions.includes(field.value) ? field.value : field.value ? "Autre Filière Spécialisée OFPPT" : ""}
                      onChange={(e) => handleSelectChange(e.target.value)}
                    >
                      <option value="" disabled>
                        -- Sélectionner directement une filière OFPPT --
                      </option>
                      {filiereOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        disabled={isSubmitting}
                        placeholder="Saisissez la filière..."
                        className="bg-white border-slate-200 text-xs font-semibold h-10 rounded-lg"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustom(false);
                          form.setValue("filiere", filiereOptions[0], { shouldDirty: true });
                        }}
                        className="text-xs text-sky-700 font-semibold hover:underline"
                      >
                        ← Choisir dans la liste des filières OFPPT
                      </button>
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {(isDirty || isCustom) && (
            <div className="flex items-center justify-end gap-x-2 pt-1">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                size="sm"
                className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-4 py-1.5 rounded-lg"
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
