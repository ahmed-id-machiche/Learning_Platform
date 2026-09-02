import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-900 font-sans p-4 sm:p-6 lg:p-12">
      {/* 1. Full-Bleed Background Image */}
      <Image
        src="/ofppt-tsge-login.jpg"
        alt="Stagiaires OFPPT TSGE"
        fill
        unoptimized
        className="object-cover opacity-60"
      />

      {/* 2. Slanted Purple Overlay Mask (Matches Template Screenshot) */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-950 via-purple-900/90 to-purple-800/60 lg:[clip-path:polygon(0_0,68%_0,52%_100%,0_100%)]" />

      {/* 3. Main Centered Split Grid */}
      <div className="relative z-10 w-full max-w-[1340px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: Template Headlines */}
        <div className="lg:col-span-7 space-y-6 text-white text-left pr-0 lg:pr-8">
          {/* Large Template Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Accédez à vos cours,<br />
            <span className="text-purple-300">
              Travaux Pratiques & EFMs.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-purple-100/90 max-w-xl font-medium leading-relaxed">
            Plateforme officielle de formation pour les stagiaires de l'OFPPT en 1ère Année et 2ème Année (Filières TSGE & TAA).
          </p>
        </div>

        {/* Right Side: Floating Card Form (Matches Template Screenshot) */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-100/80 backdrop-blur-xl">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;