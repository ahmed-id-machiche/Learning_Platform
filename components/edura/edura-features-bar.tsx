import { BookOpen, ShieldCheck, UserCheck, FileCheck, Users } from "lucide-react";

export const EduraFeaturesBar = () => {
  const features = [
    {
      icon: BookOpen,
      title: "200+ Modules Officiels",
      desc: "Programme Conforme OFPPT",
    },
    {
      icon: ShieldCheck,
      title: "Accès Illimité 24/7",
      desc: "Révisez à tout moment",
    },
    {
      icon: UserCheck,
      title: "Support Formateurs",
      desc: "Assistance pédagogique",
    },
    {
      icon: FileCheck,
      title: "Exercices & EFM Corrigés",
      desc: "Préparation aux Examens",
    },
    {
      icon: Users,
      title: "Communauté Stagiaires",
      desc: "Entraide TSGE & TAA",
    },
  ];

  return (
    <div className="bg-white py-6 border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-300 hover:bg-sky-50/50 transition-all duration-200"
              >
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-2xs">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs text-slate-900 truncate">
                    {feat.title}
                  </h4>
                  <p className="text-[10px] font-medium text-slate-500 truncate">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
