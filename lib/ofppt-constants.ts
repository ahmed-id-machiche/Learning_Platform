export type AcademicYear = "1ère Année" | "2ème Année";

export interface FiliereOption {
  value: string;
  label: string;
  shortName: string;
  parentFiliere: "TSGE" | "TAA";
  year: AcademicYear;
  description?: string;
}

export const ACADEMIC_YEARS: AcademicYear[] = ["1ère Année", "2ème Année"];

export const OFPPT_FILIERES: FiliereOption[] = [
  // 1ère Année
  {
    value: "1ère Année TSGE",
    label: "1ère Année TSGE (Tronc Commun)",
    shortName: "1ère Année TSGE",
    parentFiliere: "TSGE",
    year: "1ère Année",
    description: "Technicien Spécialisé en Gestion des Entreprises - Tronc Commun",
  },
  {
    value: "1ère Année TAA",
    label: "1ère Année TAA (Tronc Commun)",
    shortName: "1ère Année TAA",
    parentFiliere: "TAA",
    year: "1ère Année",
    description: "Technicien en Administration & Assistanat - Tronc Commun",
  },

  // 2ème Année - TSGE Options (Exact folder names from curriculum)
  {
    value: "TSGE CF",
    label: "TSGE CF (Comptabilité & Finance)",
    shortName: "TSGE CF",
    parentFiliere: "TSGE",
    year: "2ème Année",
    description: "Spécialisation Comptabilité et Finance",
  },
  {
    value: "TSGE CM",
    label: "TSGE CM (Commerce & Marketing)",
    shortName: "TSGE CM",
    parentFiliere: "TSGE",
    year: "2ème Année",
    description: "Spécialisation Commerce et Marketing",
  },
  {
    value: "TSGE OM",
    label: "TSGE OM (Organisation & Management)",
    shortName: "TSGE OM",
    parentFiliere: "TSGE",
    year: "2ème Année",
    description: "Spécialisation Organisation et Management",
  },
  {
    value: "TSGE RH",
    label: "TSGE RH (Ressources Humaines)",
    shortName: "TSGE RH",
    parentFiliere: "TSGE",
    year: "2ème Année",
    description: "Spécialisation Gestion des Ressources Humaines",
  },

  // 2ème Année - TAA Options (Exact folder names from curriculum)
  {
    value: "TAA Comptabilité",
    label: "TAA Comptabilité",
    shortName: "TAA Comptabilité",
    parentFiliere: "TAA",
    year: "2ème Année",
    description: "Technicien en Administration option Comptabilité",
  },
  {
    value: "TAA Gestion",
    label: "TAA Gestion",
    shortName: "TAA Gestion",
    parentFiliere: "TAA",
    year: "2ème Année",
    description: "Technicien en Administration option Gestion",
  },
];

export const getFilieresForYear = (year: AcademicYear): FiliereOption[] => {
  return OFPPT_FILIERES.filter((f) => f.year === year);
};
