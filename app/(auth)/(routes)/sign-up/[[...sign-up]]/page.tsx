import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  return (
    <>
      <ClerkLoading>
        <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-white rounded-3xl shadow-2xl border border-slate-100/80 w-full max-w-md min-h-[440px]">
          <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Chargement de l'inscription...</p>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <SignUp fallbackRedirectUrl="/" />
      </ClerkLoaded>
    </>
  );
}