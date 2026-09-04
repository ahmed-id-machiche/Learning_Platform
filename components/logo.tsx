import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/" className="flex flex-col items-center justify-center hover:opacity-90 transition group font-sans py-1">
      {/* OFPPT-Inspired 3 Interlocking Diamonds Graphic (Mathematically Centered) */}
      <svg className="h-6 w-auto shrink-0" viewBox="0 0 70 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left Diamond (Green) */}
        <g transform="translate(19, 14) rotate(45)">
          <rect x="-7" y="-7" width="14" height="14" rx="1.5" stroke="#009640" strokeWidth="3" fill="none" />
        </g>
        {/* Center Diamond (Grey) */}
        <g transform="translate(35, 14) rotate(45)">
          <rect x="-7" y="-7" width="14" height="14" rx="1.5" stroke="#8E9095" strokeWidth="3" fill="none" />
        </g>
        {/* Right Diamond (Blue) */}
        <g transform="translate(51, 14) rotate(45)">
          <rect x="-7" y="-7" width="14" height="14" rx="1.5" stroke="#00509D" strokeWidth="3" fill="none" />
        </g>
      </svg>

      {/* Typography BELOW the 3 diamond squares (Centered) */}
      <div className="flex flex-col items-center text-center mt-0.5">
        <span className="font-black text-sm text-[#00509D] tracking-widest leading-tight">
          HIM
        </span>
        <span className="text-[8px] font-extrabold text-slate-700 tracking-wider uppercase leading-none whitespace-nowrap">
          HASSAN ID MACHICHE
        </span>
      </div>
    </Link>
  );
};
