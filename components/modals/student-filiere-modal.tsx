"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, CheckCircle2, BookOpen } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  ACADEMIC_YEARS,
  AcademicYear,
  getFilieresForYear,
} from "@/lib/ofppt-constants";
import { Button } from "@/components/ui/button";

interface StudentFiliereModalProps {
  initialProfile?: {
    year: string;
    filiere: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  forceOnboarding?: boolean;
}

export const StudentFiliereModal = ({
  initialProfile,
  isOpen,
  onClose,
  forceOnboarding = false,
}: StudentFiliereModalProps) => {
  const router = useRouter();

  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(
    (initialProfile?.year as AcademicYear) || null
  );
  const [selectedFiliere, setSelectedFiliere] = useState<string>(
    initialProfile?.filiere || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setSelectedYear((initialProfile.year as AcademicYear) || null);
      setSelectedFiliere(initialProfile.filiere || "");
    }
  }, [initialProfile]);

  if (!isOpen) return null;

  const handleYearSelect = (year: AcademicYear) => {
    setSelectedYear(year);
    // If switching year, reset filiere unless it already matches the new year
    const available = getFilieresForYear(year);
    if (!available.some((f) => f.value === selectedFiliere)) {
      setSelectedFiliere("");
    }
  };

  const handleSave = async () => {
    if (!selectedYear || !selectedFiliere) {
      toast.error("Veuillez sélectionner votre année d'études et votre filière.");
      return;
    }

    try {
      setIsLoading(true);
      await axios.patch("/api/user/profile", {
        year: selectedYear,
        filiere: selectedFiliere,
      });

      toast.success("Parcours d'apprentissage configuré avec succès !");
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la sauvegarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentAvailableFilieres = selectedYear
    ? getFilieresForYear(selectedYear)
    : [];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-auto transform transition-all">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white relative">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
              <GraduationCap className="h-6 w-6 text-purple-200" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-200 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              Configuration de votre Espace
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Choisissez votre Année & Filière
          </h2>
          <p className="text-sm text-purple-100/90 mt-1">
            Indiquez si vous êtes en 1ère Année ou 2ème Année afin d'adapter automatiquement vos cours, devoirs et EFMs.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: Select Year */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                1
              </span>
              Étape 1 : Choisissez votre Année d'Études
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACADEMIC_YEARS.map((year) => {
                const isSelected = selectedYear === year;
                return (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all duration-200 flex flex-col justify-between relative cursor-pointer ${
                      isSelected
                        ? "border-purple-700 bg-purple-50/70 ring-2 ring-purple-500/20 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100/60"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-purple-700">
                        <CheckCircle2 className="h-5 w-5 fill-purple-700 text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 mb-2">
                      <BookOpen
                        className={`h-5 w-5 ${
                          isSelected ? "text-purple-700" : "text-slate-400"
                        }`}
                      />
                      <span className="font-extrabold text-base text-slate-900">
                        {year}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {year === "1ère Année"
                        ? "Tronc Commun pour TSGE & TAA (Compétences fondamentales)"
                        : "Spécialisation professionnelle (TSGE CF, CM, OM, RH, TAA)"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Select Option / Filière */}
          {selectedYear && (
            <div className="space-y-3 pt-3 border-t border-slate-100 animate-in fade-in duration-300">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                  2
                </span>
                Étape 2 : Sélectionner votre Filière / Option ({selectedYear})
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentAvailableFilieres.map((filiere) => {
                  const isSelected = selectedFiliere === filiere.value;
                  return (
                    <button
                      key={filiere.value}
                      type="button"
                      onClick={() => setSelectedFiliere(filiere.value)}
                      className={`p-4 rounded-2xl text-left border-2 transition-all duration-200 relative flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "border-purple-700 bg-purple-50/70 ring-2 ring-purple-500/20 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-purple-700">
                          <CheckCircle2 className="h-5 w-5 fill-purple-700 text-white" />
                        </div>
                      )}
                      <div>
                        <div className="inline-block px-2.5 py-0.5 rounded-md bg-purple-100/80 text-[10px] font-bold text-purple-800 mb-1.5 border border-purple-200">
                          {filiere.parentFiliere}
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 pr-5">
                          {filiere.shortName}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-medium">
                          {filiere.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {!forceOnboarding && (
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
            >
              Fermer
            </Button>
          )}

          <Button
            disabled={!selectedYear || !selectedFiliere || isLoading}
            onClick={handleSave}
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-xs ml-auto transition-all cursor-pointer"
          >
            {isLoading ? (
              <span>Enregistrement...</span>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Accéder à mon espace</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
