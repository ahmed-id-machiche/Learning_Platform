"use client";

import { ArrowRight, BookOpen, FileCheck, Layers, Award, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  profile?: {
    year: string;
    filiere: string;
  } | null;
}

export const HeroSection = ({ profile }: HeroSectionProps) => {
  return (
    <div className="relative bg-gradient-to-b from-purple-50/60 via-indigo-50/30 to-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
      <div className="max-w-[1340px] mx-auto">
        {/* Main Hero Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Headlines & CTA Buttons */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
            {/* Top Tagline */}
            <div className="flex items-center gap-2 text-purple-700 text-xs sm:text-sm font-extrabold uppercase tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
              <span>Espace Stagiaire OFPPT TAA TSGE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Apprendre. Build.<br />
              <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Réussir.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl font-medium leading-relaxed">
              Accédez aux cours officiels, travaux pratiques et EFM corrigés pour les filières <strong className="text-slate-900 font-bold">TSGE</strong> et <strong className="text-slate-900 font-bold">TAA</strong>.
            </p>

            {/* Udemy Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#modules-section"
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>Explorer les modules</span>
              </a>

              <Link
                href="/resources"
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-slate-300 transition-all flex items-center gap-2"
              >
                <FileCheck className="h-4 w-4 text-purple-700" />
                <span>Devoirs & EFMs</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Graphic with Floating Filières Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-2 lg:pt-0">
            {/* Background Ambient Glow */}
            <div className="absolute w-[320px] h-[320px] rounded-full bg-gradient-to-tr from-purple-300/40 via-indigo-300/30 to-sky-200/40 blur-2xl pointer-events-none" />

            {/* Main Student Card Container */}
            <div className="relative w-full max-w-[460px] aspect-[16/11] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
              <Image
                src="/ofppt-tsge-hero.jpg"
                alt="Stagiaires OFPPT TSGE"
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Floating Card 1: TSGE Filière Badge (Top Right) with Floating Motion */}
            <div className="absolute -top-4 -right-2 sm:-right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-purple-200 text-left flex items-center gap-3 animate-bounce [animation-duration:3s]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md shadow-purple-500/20">
                TSGE
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md inline-block mb-0.5 border border-purple-100">
                  Filière Officielle
                </span>
                <h4 className="text-xs font-black text-slate-900 truncate">Filière TSGE</h4>
                <span className="text-[10px] text-slate-500 font-bold">Gestion des Entreprises</span>
              </div>
            </div>

            {/* Floating Card 2: TAA Filière Badge (Bottom Left) with Floating Motion */}
            <div className="absolute -bottom-4 -left-2 sm:-left-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-emerald-200 text-left flex items-center gap-3 animate-bounce [animation-duration:3.5s]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md shadow-emerald-500/20">
                TAA
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-0.5 border border-emerald-100">
                  Filière Officielle
                </span>
                <h4 className="text-xs font-black text-slate-900 truncate">Filière TAA</h4>
                <span className="text-[10px] text-slate-500 font-bold">Assistanat & Administration</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
