import { CheckCircle2, ArrowRight, Award, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const EduraAboutSection = () => {
  return (
    <section className="py-16 bg-slate-50/60 border-b border-slate-100 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Overlapping Photos & Experience Badge */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-lg border-2 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Étudiants en classe"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-lg border-2 border-white mt-8">
                <Image
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                  alt="Formation travail de groupe"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>

            {/* Circular Experience Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-blue-600 text-white p-5 rounded-full shadow-2xl border-4 border-white flex flex-col items-center justify-center text-center w-36 h-36">
              <GraduationCap className="h-6 w-6 text-sky-200 mb-1" />
              <span className="font-black text-xl leading-none">OFPPT</span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-sky-200 mt-1">
                Conforme
              </span>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200/80">
              À propos de la plateforme
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Plongez dans nos Modules et Propulsez votre Carrière !
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Conçue pour accompagner la réussite des stagiaires OFPPT en <strong className="text-slate-900">TSGE</strong> (Technicien Spécialisé en Gestion des Entreprises) et <strong className="text-slate-900">TAA</strong> (Technicien Assistant Administratif), notre plateforme rassemble cours vidéo, résumés PDF et EFM corrigés.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Parcours Personnalisé 1ère & 2ème Année</h4>
                  <p className="text-xs text-slate-500">Tronc Commun et spécialisations (CF, CM, OM, RH, Comptabilité, Gestion).</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Exercices & Examens Corrigés (EFM)</h4>
                  <p className="text-xs text-slate-500">Préparez vos examens de fin de module avec les sujets originaux des années précédentes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Assistance par l'Intelligence Artificielle</h4>
                  <p className="text-xs text-slate-500">Un assistant IA pédagogique disponible à tout moment pour répondre à vos questions de cours.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all group"
              >
                <span>EN SAVOIR PLUS →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
