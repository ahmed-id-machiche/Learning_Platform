import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Navbar } from "./_components/navbar";
import { Footer } from "@/components/footer";

import { isTeacher } from "@/lib/teacher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (userId) {
    const isBlocked = await db.blockedStudent.findUnique({
      where: { userId },
    });

    if (isBlocked) {
      return redirect("/blocked");
    }

    if (!isTeacher(userId)) {
      const studentProfile = await db.studentProfile.findUnique({
        where: { userId },
      });

      if (studentProfile && !studentProfile.isApproved) {
        return redirect("/pending-approval");
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      {/* Top Navbar (100% Full Width) */}
      <header className="h-[72px] fixed inset-x-0 top-0 w-full z-50">
        <Navbar />
      </header>

      {/* Main Page Content */}
      <main className="pt-[72px] flex-1 w-full flex flex-col justify-between">
        <div className="flex-1">
          {children}
        </div>

        {/* Global Udemy-Style Footer */}
        <Footer />
      </main>
    </div>
  );
}
