import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Navbar } from "./_components/navbar";

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
  }

  return (
    <div className="min-h-full bg-slate-50/50">
      {/* Top Navbar (100% Full Width) */}
      <header className="h-[72px] fixed inset-x-0 top-0 w-full z-50">
        <Navbar />
      </header>

      {/* Main Page Content (100% Full Width) */}
      <main className="pt-[72px] min-h-screen w-full">
        {children}
      </main>
    </div>
  );
}
