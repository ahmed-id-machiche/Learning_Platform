"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ShieldAlert, RefreshCw, LogOut, CheckCircle2, GraduationCap } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import axios from "axios";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { OFPPT_FILIERES } from "@/lib/ofppt-constants";

export default function PendingApprovalPage() {
  const router = useRouter();
  const { signOut } = useClerk();

  const [profile, setProfile] = useState<{ year: string; filiere: string; isApproved: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const checkStatus = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get("/api/user/profile");
      if (res.data) {
        setProfile(res.data);
        if (res.data.isApproved) {
          router.push("/");
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Failed to fetch status:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const matchedFiliere = OFPPT_FILIERES.find((f) => f.value === profile?.filiere);
  const filiereLabel = matchedFiliere ? matchedFiliere.label : profile?.filiere || "Option Sélectionnée";

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 font-sans relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 space-y-6 text-center">
        {/* Top Branding Logo */}
        <div className="flex justify-center pb-2">
          <Logo />
        </div>

        {/* Status Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
          <Clock className="h-10 w-10 animate-pulse" />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="h-4 w-4 text-amber-700" />
          <span>Inscription En Attente de Validation</span>
        </div>

        {/* Heading & Subtext */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Compte Stagiaire En Attente
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Votre demande d'inscription a bien été enregistrée. Votre Formateur doit valider votre accès avant que vous puissiez consulter l'ensemble des cours et devoirs.
          </p>
        </div>

        {/* Selected Profile Details */}
        {profile && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-left space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Vos informations d'inscription :
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900">
                  {profile.year}
                </div>
                <div className="text-xs text-slate-600 font-semibold">
                  {filiereLabel}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Button
            onClick={checkStatus}
            disabled={refreshing}
            className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Vérification..." : "Vérifier l'Approbation"}</span>
          </Button>

          <Button
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            variant="outline"
            className="w-full sm:w-auto text-slate-600 hover:text-slate-900 border-slate-200 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Se Déconnecter</span>
          </Button>
        </div>

        {/* Footer info note */}
        <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
          Pour accélérer la validation, contactez directement votre Formateur HIM / OFPPT.
        </p>
      </div>
    </div>
  );
}
