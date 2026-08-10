import { UserButton, SignOutButton } from "@clerk/nextjs";
import { ShieldAlert, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlockedPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30">
          <ShieldAlert className="h-8 w-8 text-rose-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Accès Suspendu
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            Votre compte étudiant a été suspendu par le formateur. Vous n'avez plus accès aux cours et aux contenus de la plateforme.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-700/60 flex flex-col gap-3">
          <SignOutButton redirectUrl="/sign-in">
            <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg">
              <LogOut className="h-4 w-4" />
              Se Déconnecter
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
