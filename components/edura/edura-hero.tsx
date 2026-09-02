"use client";

import { CheckCircle2, ArrowRight, BookOpen, Users, Award, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { StudentFiliereSelector } from "@/components/student-filiere-selector";

interface EduraHeroProps {
  profile?: {
    year: string;
    filiere: string;
  } | null;
}

export const EduraHero = ({ profile }: EduraHeroProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-blue-50/40 to-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
      {/* Background Decorative Circular Grid Lines */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full border border-sky-200/50 pointer-events-none -z-0" />
      <div className="absolute bottom-5 right-20 w-96 h-96 rounded-full border border-blue-200/40 pointer-events-none -z-0" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-sky-200/20 blur-3xl pointer-events-none -z-0" />

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Tag Line */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200/80 text-xs font-extrabold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Formation Professionnelle OFPPT
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            La Formation En Ligne <br className="hidden sm:inline" />
            <span className="text-blue-600">Comme En Classe Réelle</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
            Plateforme d'apprentissage officielle pour les stagiaires de l'OFPPT en <strong className="text-slate-900 font-bold">1ère Année</strong> et <strong className="text-slate-900 font-bold">2ème Année (TSGE & TAA)</strong>. Accédez à vos modules, travaux pratiques et EFM corrigés.
          </p>

          {/* Bullet checklist */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs sm:text-sm font-bold text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100" />
              <span>Diplôme Reconnu (TSGE & TAA)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100" />
              <span>Exercices & EFM Corrigés</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-100" />
              <span>Suivi en Temps Réel</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link
              href="#courses-section"
              className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2.5 group"
            >
              <span>COMMENCER MON PARCOURS</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/resources"
              className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2.5"
            >
              <BookOpen className="h-4 w-4 text-sky-400" />
              <span>EXPLORER LES RESSOURCES</span>
            </Link>
          </div>

          {/* Student Profile Quick Display */}
          <div className="pt-2">
            <StudentFiliereSelector initialProfile={profile} />
          </div>
        </div>

        {/* Right Column: EDURA Hero Graphic & Stats Badges */}
        <div className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
          {/* Circular Background Ring Accent */}
          <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full bg-gradient-to-tr from-sky-400/30 to-blue-600/20 blur-xl pointer-events-none" />

          <div className="relative w-full max-w-[440px] aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
              alt="Stagiaire OFPPT"
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {/* Floating Stat Badge 1 (Top Left) */}
          <div className="absolute -top-2 -left-2 sm:left-4 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in slide-in-from-left duration-500">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900">16,500+</div>
              <div className="text-[11px] font-semibold text-slate-500">Stagiaires Actifs</div>
            </div>
          </div>

          {/* Floating Stat Badge 2 (Bottom Right) */}
          <div className="absolute -bottom-4 -right-2 sm:right-4 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-in fade-in slide-in-from-right duration-500">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-xs">
              <Play className="h-5 w-5 fill-white" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900">7,500+</div>
              <div className="text-[11px] font-semibold text-slate-500">Modules & Vidéos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
