import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      fallbackRedirectUrl="/"
      appearance={{
        elements: {
          rootBox: "w-full flex justify-center",
          card: "shadow-2xl border border-slate-200/90 rounded-2xl bg-white/95 backdrop-blur-xl p-6 sm:p-8 w-full max-w-md",
          headerTitle: "text-2xl font-extrabold text-slate-900 tracking-tight",
          headerSubtitle: "text-xs font-medium text-slate-500 mt-1",
          formButtonPrimary: "bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl h-11 shadow-md transition-all cursor-pointer border-0",
          socialButtonsBlockButton: "border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 h-10 transition-colors",
          formFieldInput: "rounded-xl border-slate-200 text-xs focus:border-blue-600 focus:ring-blue-600 h-10 shadow-xs",
          formFieldLabel: "text-xs font-semibold text-slate-700",
          footerActionLink: "text-blue-700 font-bold hover:underline",
          footer: "border-t border-slate-100 text-xs text-slate-500 pt-4",
          identityPreviewText: "text-xs text-slate-700 font-medium",
          formResendCodeLink: "text-blue-700 font-bold hover:underline",
        },
      }}
    />
  );
}