import { GraduationCap, BookOpen, Layers, UserCheck } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-100 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Left Column: Official OFPPT Royal Blue Hero Panel */}
      <div className="relative lg:w-1/2 min-h-[460px] lg:min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600 via-blue-800 to-indigo-950 p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden text-white shadow-2xl">
        {/* Subtle Curved Wave Lighting Blobs */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-[500px] h-[500px] rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-[450px] h-[450px] rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        {/* Top Header: OFPPT Emblem & Logo */}
        <div className="relative z-10 flex items-center gap-x-3.5">
          <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-md">
            <div className="grid grid-cols-2 gap-1 w-6 h-6">
              <div className="bg-emerald-400 rounded-xs"></div>
              <div className="bg-sky-400 rounded-xs"></div>
              <div className="bg-blue-300 rounded-xs"></div>
              <div className="bg-white rounded-xs"></div>
            </div>
          </div>
          <div>
            <div className="text-xl font-black tracking-wider uppercase text-white flex items-center gap-2">
              OFPPT
            </div>
            <p className="text-[10px] text-blue-100/80 uppercase font-semibold tracking-wider leading-tight">
              Formation Professionnelle et Promotion du Travail
            </p>
          </div>
        </div>

        {/* Middle Hero Main Heading */}
        <div className="relative z-10 my-10 lg:my-0 space-y-6 max-w-xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Bienvenue sur votre portail d'apprentissage OFPPT
          </h1>

          {/* 4 Pill Badges Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="flex items-center gap-x-2.5 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-xs hover:bg-white/25 transition-all">
              <GraduationCap className="h-4 w-4 text-white shrink-0" />
              <span className="text-xs font-semibold text-white whitespace-nowrap">Parcours Personnalisés</span>
            </div>

            <div className="flex items-center gap-x-2.5 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-xs hover:bg-white/25 transition-all">
              <BookOpen className="h-4 w-4 text-white shrink-0" />
              <span className="text-xs font-semibold text-white whitespace-nowrap">Ressources Numériques</span>
            </div>

            <div className="flex items-center gap-x-2.5 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-xs hover:bg-white/25 transition-all">
              <Layers className="h-4 w-4 text-white shrink-0" />
              <span className="text-xs font-semibold text-white whitespace-nowrap">Accès Formations</span>
            </div>

            <div className="flex items-center gap-x-2.5 px-4 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 shadow-xs hover:bg-white/25 transition-all">
              <UserCheck className="h-4 w-4 text-white shrink-0" />
              <span className="text-xs font-semibold text-white whitespace-nowrap">Suivi Pédagogique</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="relative z-10 text-xs text-blue-100/70 font-medium">
          © {new Date().getFullYear()} OFPPT — Royaume du Maroc
        </div>
      </div>

      {/* Right Column: Soft White Rounded Card Container */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 min-h-[600px] lg:min-h-screen relative">
        <div className="relative z-10 w-full max-w-md flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;