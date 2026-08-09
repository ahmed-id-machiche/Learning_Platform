import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      fallbackRedirectUrl="/"
      appearance={{
        elements: {
          rootBox: "w-full flex justify-center",
          card: "shadow-2xl border border-slate-200/90 rounded-[32px] bg-white/95 backdrop-blur-xl p-6 sm:p-10 w-full max-w-md ring-1 ring-slate-900/5",
          headerTitle: "text-2xl font-black text-slate-900 tracking-tight text-center",
          headerSubtitle: "text-xs font-medium text-slate-500 mt-1 text-center",
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-full h-12 shadow-lg shadow-blue-600/30 transition-all cursor-pointer border-0",
          socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-semibold text-slate-700 h-11 transition-colors shadow-2xs",
          formFieldInput: "rounded-full border-slate-200 text-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 h-11 px-5 bg-slate-50/50 focus:bg-white transition-all",
          formFieldLabel: "text-xs font-semibold text-slate-700 ml-2",
          footerActionLink: "text-blue-600 font-bold hover:underline",
          footer: "border-t border-slate-100 text-xs text-slate-500 pt-4 text-center",
          identityPreviewText: "text-xs text-slate-700 font-medium",
          formResendCodeLink: "text-blue-600 font-bold hover:underline",
          dividerLine: "bg-slate-200",
          dividerText: "text-slate-400 text-[11px] uppercase tracking-wider font-semibold",
        },
      }}
    />
  );
}