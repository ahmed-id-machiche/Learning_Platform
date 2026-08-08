"use client";

import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { isTeacher } from "@/lib/teacher";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const { userId } = useAuth();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  return (
    <div className="flex items-center gap-x-3 ml-auto shrink-0">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <Button size="sm" variant="ghost" className="text-slate-700 hover:text-slate-900 font-semibold rounded-xl">
            <LogOut className="h-4 w-4 mr-2" />
            Quitter
          </Button>
        </Link>
      ) : isTeacher(userId) ? (
        <Link href="/teacher/courses">
          <Button size="sm" variant="ghost" className="text-slate-700 hover:text-slate-900 font-semibold rounded-xl bg-slate-100/70 hover:bg-slate-200">
            Mode Formateur
          </Button>
        </Link>
      ) : null}

      {!userId ? (
        <Link href="/sign-in">
          <Button size="sm" className="bg-sky-700 hover:bg-sky-800 text-white font-bold px-4 rounded-xl shadow-xs flex items-center gap-1.5">
            <LogIn className="h-4 w-4" />
            <span>Se Connecter</span>
          </Button>
        </Link>
      ) : (
        <UserButton />
      )}
    </div>
  );
};
