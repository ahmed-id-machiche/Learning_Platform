"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle2, GraduationCap } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import {
  ACADEMIC_YEARS,
  AcademicYear,
  OFPPT_FILIERES,
  getFilieresForYear,
} from "@/lib/ofppt-constants";

interface FiliereFormProps {
  initialData: {
    filiere: string | null;
  };
  courseId: string;
}

const formSchema = z.object({
  filiere: z.string().min(1, {
    message: "La filière est requise",
  }),
});

export const FiliereForm = ({
  initialData,
  courseId,
}: FiliereFormProps) => {
  const router = useRouter();

  // Find initial year based on existing filiere value if available
  const initialFiliereObj = OFPPT_FILIERES.find(
    (f) => f.value === initialData.filiere
  );
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(
    initialFiliereObj ? initialFiliereObj.year : "2ème Année"
  );

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
      toast.error("Une erreur est survenue lors de la mise à jour");
    }
  };

  const handleYearSelect = (year: AcademicYear) => {
    setSelectedYear(year);
    // Automatically reset filiere selection when changing year
    form.setValue("filiere", "", { shouldDirty: true });
  };

  const availableFilieres = selectedYear
    ? getFilieresForYear(selectedYear)
    : OFPPT_FILIERES;

  return (
    <div className="mt-6 border bg-slate-100/90 rounded-2xl p-5 space-y-4 font-sans">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-5 w-5 text-purple-700" />
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
          Affectation Année & Filière OFPPT :
        </label>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* STEP 1: Select Academic Year */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block">
              1. Choisir l'Année d'Études :
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ACADEMIC_YEARS.map((year) => {
                const isSelected = selectedYear === year;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "border-purple-700 bg-purple-700 text-white shadow-xs"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      {year}
                    </span>
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Select Filière / Option */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block">
              2. Sélectionner la Filière / Option ({selectedYear || "Toutes"}) :
            </span>

            <FormField
              control={form.control}
              name="filiere"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <select
                      disabled={isSubmitting}
                      className="w-full h-11 px-3 text-xs font-extrabold rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer shadow-xs"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        -- Sélectionner la filière du module --
                      </option>
                      <option value="Tous les étudiants (Général)">
                        Tous les étudiants (Module Général)
                      </option>
                      {availableFilieres.map((filiere) => (
                        <option key={filiere.value} value={filiere.value}>
                          {filiere.label} [{filiere.parentFiliere}]
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isDirty && (
            <div className="flex items-center justify-end gap-x-2 pt-2 border-t border-slate-200">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
                size="sm"
                className="bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs px-5 py-2 rounded-xl shadow-xs cursor-pointer"
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer la filière"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
