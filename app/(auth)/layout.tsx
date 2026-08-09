import { GraduationCap, BookOpen, CheckCircle2, Sparkles, Award } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Left Column: Option 1 Deep Royal Blue Branding Hero Panel */}
      <div className="relative lg:w-1/2 min-h-[420px] lg:min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800/80">
        {/* Ambient Glowing Lighting Effects */}
        <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 rounded-full bg-blue-600/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-96 h-96 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-x-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <span className="text-xl font-extrabold tracking-tight text-white">Learning Platform</span>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-400/30 uppercase tracking-wider">
                OFPPT
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Plateforme d'Apprentissage Digital Moderne</p>
          </div>
        </div>

        {/* Middle Hero Showcase */}
        <div className="relative z-10 my-10 lg:my-0 space-y-6 max-w-xl">
          <div className="inline-flex items-center gap-x-2 bg-blue-500/15 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-200 backdrop-blur-md shadow-xs">
            <Sparkles className="h-4 w-4 text-sky-400" />
            <span>Formation Professionnelle & Certifiante</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Accédez à vos <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">Modules & Corrigés</span> en un clic.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Plateforme éducative intégrée conçue pour les stagiaires et formateurs OFPPT. Suivez vos cours, téléchargez les travaux pratiques (TPs), préparez vos examens de fin de module (EFMs) et collaborez en temps réel.
          </p>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="p-2 rounded-lg bg-blue-500/20 text-sky-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200">Modules par Filières</span>
            </div>

            <div className="flex items-center gap-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200">TPs & EFMs Corrigés</span>
            </div>

            <div className="flex items-center gap-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200">Assistant IA Pédagogique</span>
            </div>

            <div className="flex items-center gap-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                <Award className="h-4 w-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200">Certificats & Ateliers</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>© {new Date().getFullYear()} Learning Platform OFPPT</span>
          <span className="hover:text-slate-200 transition-colors cursor-pointer">Support Pédagogique</span>
        </div>
      </div>

      {/* Right Column: Option 1 Clean White Glassmorphism Container */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50/90 min-h-[600px] lg:min-h-screen relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        <div className="relative z-10 w-full max-w-md flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;