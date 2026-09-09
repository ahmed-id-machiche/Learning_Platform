"use client";

import { Button } from "@/components/ui/button";
import { LogIn, LogOut, ShieldCheck, GraduationCap } from "lucide-react";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { isTeacher } from "@/lib/teacher";
import { StudentFiliereSelector } from "@/components/student-filiere-selector";

import { useEffect, useState } from "react";
import axios from "axios";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const { userId } = useAuth();
  const [pendingCount, setPendingCount] = useState<number>(0);

  const isTeacherUser = isTeacher(userId);
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  const fetchPendingCount = () => {
    if (!isTeacherUser) return;
    axios
      .get("/api/students/pending-count")
      .then((res) => {
        if (typeof res.data?.count === "number") {
          setPendingCount(res.data.count);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!isTeacherUser) return;

    fetchPendingCount();

    const handleUpdate = () => fetchPendingCount();
    window.addEventListener("pending-students-updated", handleUpdate);
    const interval = setInterval(fetchPendingCount, 10000);

    return () => {
      window.removeEventListener("pending-students-updated", handleUpdate);
      clearInterval(interval);
    };
  }, [isTeacherUser, pathname]);

  return (
    <div className="flex items-center gap-x-3 ml-auto shrink-0 font-sans">
      {/* Student Filière Selector Badge & Auto Onboarding Trigger (Students only) */}
      {userId && !isTeacherUser && !isTeacherPage && !isPlayerPage && (
        <StudentFiliereSelector />
      )}

      {isTeacherPage || isPlayerPage ? (
        <Link href="/">
          <Button size="sm" variant="ghost" className="text-slate-700 hover:text-slate-900 font-extrabold rounded-xl border border-slate-200 hover:bg-slate-100">
            <LogOut className="h-4 w-4 mr-1.5 text-slate-500" />
            <span>Quitter le Mode Formateur</span>
          </Button>
        </Link>
      ) : isTeacherUser ? (
        <Link href="/teacher/courses">
          <Button
            size="sm"
            className="bg-purple-700 hover:bg-purple-800 text-white font-black px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-2 text-xs border border-purple-600/40 cursor-pointer relative"
          >
            <ShieldCheck className="h-4 w-4 text-purple-200" />
            <span>Mode Formateur</span>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-xs animate-pulse ml-0.5">
                {pendingCount}
              </span>
            )}
          </Button>
        </Link>
      ) : null}

      {!userId ? (
        <Link href="/sign-in">
          <Button size="sm" className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 rounded-xl shadow-xs flex items-center gap-1.5">
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