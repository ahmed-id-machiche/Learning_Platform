"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, GraduationCap } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

import {
  ACADEMIC_YEARS,
  AcademicYear,
  getFilieresForYear,
  OFPPT_FILIERES,
} from "@/lib/ofppt-constants";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Le titre est requis",
  }),
  filiere: z.string().optional(),
});

const CreatePage = () => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<AcademicYear>("2ème Année");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      filiere: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Module créé avec succès !");
    } catch {
      toast.error("Une erreur s'est produite lors de la création.");
    }
  };

  const handleYearSelect = (year: AcademicYear) => {
    setSelectedYear(year);
    form.setValue("filiere", "", { shouldValidate: true });
  };

  const availableFilieres = getFilieresForYear(selectedYear);

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans flex items-center justify-center min-h-[calc(100vh-140px)]">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl max-w-2xl w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Espace Formateur OFPPT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Créer un nouveau module de formation
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-medium leading-relaxed">
            Configurez l'intitulé de votre module et affectez-le directement à l'année d'études et la filière concernées.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* 1. Titre du module */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-extrabold text-slate-800 text-sm">
                    Titre du module *
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="ex: 'M102 - Comptabilité Générale (Principes de Base)'"
                      className="h-11 rounded-xl text-sm font-medium border-slate-300 focus:ring-purple-500 focus:border-purple-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500">
                    Quel est l'intitulé officiel de ce module OFPPT ?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 2. Année d'Études (1ère Année vs 2ème Année) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="font-extrabold text-slate-800 text-sm block">
                Étape 1 : Choisir l'Année d'Études *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ACADEMIC_YEARS.map((year) => {
                  const isSelected = selectedYear === year;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      className={`p-3.5 rounded-2xl text-xs font-extrabold border-2 transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "border-purple-700 bg-purple-50/70 text-purple-900 ring-2 ring-purple-500/20 shadow-xs"
                          : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className={`h-4 w-4 ${isSelected ? "text-purple-700" : "text-slate-400"}`} />
                        {year}
                      </span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-purple-700 fill-purple-700 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Filière / Option */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="font-extrabold text-slate-800 text-sm block">
                Étape 2 : Sélectionner la Filière / Option ({selectedYear}) *
              </label>

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
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <option value="">
                          -- (Optionnel) Affecter à une filière spécifique --
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

            <div className="flex items-center gap-x-3 pt-4 border-t border-slate-100">
              <Link href="/teacher/courses">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-xl font-bold text-xs"
                >
                  Annuler
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer ml-auto"
              >
                {isSubmitting ? "Création..." : "Créer le module"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;