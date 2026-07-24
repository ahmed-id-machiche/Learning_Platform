import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-x-2.5 hover:opacity-90 transition">
      <svg className="h-8 w-8 text-[#0070f3]" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="16" width="18" height="18" rx="3" stroke="#0070F3" strokeWidth="3.5" fill="none" />
        <circle cx="24" cy="14" r="7" stroke="#0070F3" strokeWidth="3.5" fill="white" />
      </svg>
      <span className="font-extrabold text-xl tracking-tight text-slate-800">
        Learning Platform
      </span>
    </Link>
  );
};