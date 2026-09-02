import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-[#1c1d1f] text-[#cea0ed] font-sans border-t border-[#2d2f31] mt-auto">
      {/* 1. Udemy Top Banner: Trust Banner */}
      <div className="border-b border-[#2d2f31] py-5">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="font-bold text-[#f7f9fa]">
            Les formateurs et stagiaires l'OFPPT font confiance à <span className="text-purple-400">OFPPT Learning Platform</span> pour développer leurs compétences.
          </div>
        </div>
      </div>

      {/* 2. Udemy Main Columns Content */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Section Title */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#f7f9fa] tracking-tight">
            Explorez les compétences et filières de formation OFPPT
          </h3>
        </div>

        {/* 4 Grid Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: TSGE Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#f7f9fa]">
              Filière TSGE (2ème Année)
            </h4>
            <ul className="space-y-2 text-xs font-normal text-slate-300">
              <li>
                <Link href="/?title=TSGE+CF" className="hover:text-purple-300 hover:underline transition-colors">
                  TSGE CF (Comptabilité & Finance)
                </Link>
              </li>
              <li>
                <Link href="/?title=TSGE+CM" className="hover:text-purple-300 hover:underline transition-colors">
                  TSGE CM (Commerce & Marketing)
                </Link>
              </li>
              <li>
                <Link href="/?title=TSGE+OM" className="hover:text-purple-300 hover:underline transition-colors">
                  TSGE OM (Office Manager / Direction)
                </Link>
              </li>
              <li>
                <Link href="/?title=TSGE+RH" className="hover:text-purple-300 hover:underline transition-colors">
                  TSGE RH (Ressources Humaines)
                </Link>
              </li>
              <li>
                <Link href="/resources?type=EFM_EXAM" className="hover:text-purple-300 hover:underline transition-colors">
                  EFMs & Corrigés TSGE
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: TAA Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#f7f9fa]">
              Filière TAA (2ème Année)
            </h4>
            <ul className="space-y-2 text-xs font-normal text-slate-300">
              <li>
                <Link href="/?title=TAA+Comptabilite" className="hover:text-purple-300 hover:underline transition-colors">
                  TAA Comptabilité
                </Link>
              </li>
              <li>
                <Link href="/?title=TAA+Gestion" className="hover:text-purple-300 hover:underline transition-colors">
                  TAA Gestion
                </Link>
              </li>
              <li>
                <Link href="/resources?type=TP_CORRIGE" className="hover:text-purple-300 hover:underline transition-colors">
                  TPs & Corrigés TAA
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: 1ère Année Tronc Commun */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#f7f9fa]">
              1ère Année (Tronc Commun)
            </h4>
            <ul className="space-y-2 text-xs font-normal text-slate-300">
              <li>
                <Link href="/?title=1ere+Annee+TSGE" className="hover:text-purple-300 hover:underline transition-colors">
                  1ère Année TSGE (Tronc Commun)
                </Link>
              </li>
              <li>
                <Link href="/?title=1ere+Annee+TAA" className="hover:text-purple-300 hover:underline transition-colors">
                  1ère Année TAA (Tronc Commun)
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-purple-300 hover:underline transition-colors">
                  Tous les supports de cours PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Nav & Platform Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#f7f9fa]">
              Navigation Rapide
            </h4>
            <ul className="space-y-2 text-xs font-normal text-slate-300">
              <li>
                <Link href="/" className="hover:text-purple-300 hover:underline transition-colors">
                  Home (Catalogue des cours)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-purple-300 hover:underline transition-colors">
                  Tableau de Bord Stagiaire
                </Link>
              </li>
              <li>
                <Link href="/homework" className="hover:text-purple-300 hover:underline transition-colors">
                  Soumettre un Devoir (PDF)
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="hover:text-purple-300 hover:underline transition-colors">
                  Annonces & Notifications
                </Link>
              </li>
              <li>
                <a href="https://www.myway.ac.ma" target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 hover:underline transition-colors">
                  Portail Officiel MyWay
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Bottom Bar: Clean Copyright */}
      <div className="border-t border-[#2d2f31] py-6">
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 font-normal">
          © {new Date().getFullYear()} <strong>OFPPT Learning Platform</strong> • Propriété de <strong>HASSAN ID MACHICHE</strong>. Tous droits réservés. (All rights reserved).
        </div>
      </div>
    </footer>
  );
};
