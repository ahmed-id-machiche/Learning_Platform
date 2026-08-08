import { Navbar } from "./_components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
