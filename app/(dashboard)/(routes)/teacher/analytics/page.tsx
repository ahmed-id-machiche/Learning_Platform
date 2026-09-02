import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { getAnalytics } from "@/actions/get-analytics";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

const AnalyticsPage = async () => {
  const { userId } = await auth();

  if (!userId || !isTeacher(userId)) {
    return redirect("/sign-in");
  }

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Udemy-Style Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl min-h-[170px] flex items-center border border-purple-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-purple-200 backdrop-blur-md border border-white/15">
            <span>Espace Formateur OFPPT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
            Statistiques & Analyses Pédagogiques
          </h1>
          <p className="text-sm text-purple-100/80 leading-relaxed font-medium pt-1 max-w-2xl">
            Aperçu de la participation et des inscriptions de vos stagiaires sur la plateforme OFPPT.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DataCard label="Volume d'Inscriptions" value={totalRevenue} shouldFormat={false} />
        <DataCard label="Total Stagiaires Inscrits" value={totalSales} />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;