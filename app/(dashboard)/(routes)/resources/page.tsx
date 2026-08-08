import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  FileCheck,
  FileText,
  Download,
  BookOpen,
  Sparkles,
  Award,
} from "lucide-react";

import { db } from "@/lib/db";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumb";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { ResourceFilters } from "./_components/resource-filters";

interface ResourcesPageProps {
  searchParams: Promise<{
    title?: string;
    type?: string;
    categoryId?: string;
  }>;
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const { userId } = await auth();
  const { title, type, categoryId } = await searchParams;

  if (!userId) {
    return redirect("/");
  }

  // Fetch categories
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  // Query attachments with filtering
  const attachments = await db.attachment.findMany({
    where: {
      ...(type ? { type: type as any } : {}),
      ...(categoryId ? { course: { categoryId } } : {}),
      ...(title
        ? {
            OR: [
              { name: { contains: title, mode: "insensitive" } },
              { course: { title: { contains: title, mode: "insensitive" } } },
              { course: { moduleCode: { contains: title, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          moduleCode: true,
          filiere: true,
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const getTypeBadge = (attachmentType: string) => {
    switch (attachmentType) {
      case "EFM_EXAM":
        return {
          label: "EFM Corrigé",
          className: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Award,
        };
      case "TP_CORRIGE":
        return {
          label: "TP Corrigé",
          className: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: FileCheck,
        };
      case "TP_SUJET":
        return {
          label: "Sujet TP",
          className: "bg-sky-100 text-sky-800 border-sky-200",
          icon: FileText,
        };
      case "COURSE_PDF":
        return {
          label: "Support PDF",
          className: "bg-indigo-100 text-indigo-800 border-indigo-200",
          icon: BookOpen,
        };
      default:
        return {
          label: "Document",
          className: "bg-slate-100 text-slate-700 border-slate-200",
          icon: FileText,
        };
    };
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-8 md:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
            <Sparkles className="h-3.5 w-3.5 text-sky-200" />
            <span>Centre de Ressources Officiel OFPPT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            EFMs & Travaux Pratiques Corrigés
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
            Téléchargez les sujets d'EFM régionaux et nationaux, les corrigés de TPs et les supports de cours au format PDF pour réussir vos évaluations.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Suspense fallback={null}>
        <ResourceFilters categories={categories} totalCount={attachments.length} />
      </Suspense>

      {/* Attachments Resources Grid */}
      <div className="space-y-4">
        {attachments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 my-6 space-y-3">
            <div className="p-4 rounded-xl bg-white shadow-xs border border-slate-200 text-slate-400">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Aucun document disponible pour ces filtres
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Essayez de sélectionner un autre type de document ou réinitialisez les filtres.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {attachments.map((attachment) => {
              const badge = getTypeBadge(attachment.type);
              const BadgeIcon = badge.icon;

              return (
                <div
                  key={attachment.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Type Badge + Module Code */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${badge.className}`}
                      >
                        <BadgeIcon className="h-3 w-3" />
                        {badge.label}
                      </span>

                      {attachment.course.moduleCode ? (
                        <span className="bg-emerald-600 text-white font-mono font-bold text-[11px] px-2 py-0.5 rounded shadow-xs">
                          {attachment.course.moduleCode}
                        </span>
                      ) : (
                        <span className="bg-sky-700 text-white font-mono font-bold text-[11px] px-2 py-0.5 rounded shadow-xs">
                          OFPPT
                        </span>
                      )}
                    </div>

                    {/* Document Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition line-clamp-2 leading-snug">
                      {attachment.name}
                    </h3>

                    {/* Course Title & Filière */}
                    <div className="space-y-1 pt-1 text-xs text-slate-500">
                      <div className="font-semibold text-slate-700 truncate">
                        Module: {attachment.course.title}
                      </div>
                      {attachment.course.filiere && (
                        <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded inline-block">
                          {attachment.course.filiere}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action: Download Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">
                      PDF Téléchargeable
                    </span>
                    <PdfDownloadButton
                      url={attachment.url}
                      name={attachment.name}
                      variant="card"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
