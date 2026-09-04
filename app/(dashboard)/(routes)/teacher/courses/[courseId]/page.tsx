import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { db } from "@/lib/db";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { Breadcrumbs } from "@/components/breadcrumb";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { ModuleCodeForm } from "./_components/module-code-form";
import { FiliereForm } from "./_components/filiere-form";
import { IsFreeForm } from "./_components/is-free-form";
import { Actions } from "./_components/actions";

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { userId } = await auth();
  const { courseId } = await params;

  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/teacher/courses");
  }

  // Allow formateur to publish freely as long as title exists
  const isComplete = !!course.title;

  return (
    <>
      {!course.isPublished && (
        <Banner label="Ce module n'est pas encore publié. Il ne sera pas visible par les étudiants." />
      )}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
        <Breadcrumbs
          items={[
            { label: "Modules de Formation", href: "/teacher/courses" },
            { label: course.moduleCode ? `[${course.moduleCode}] ${course.title}` : course.title },
          ]}
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Configuration du Module OFPPT</h1>
            <span className="text-sm text-slate-600 font-medium">
              Renseignez les détails du module, la filière concernée, les chapitres et les devoirs/supports PDF.
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl font-bold text-slate-800">Informations Générales du Module</h2>
            </div>
            <ModuleCodeForm initialData={course} courseId={course.id} />
            <TitleForm initialData={course} courseId={course.id} />
            <FiliereForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl font-bold text-slate-800">Chapitres & Cours du Module</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl font-bold text-slate-800">Accès & Tarification</h2>
              </div>
              <IsFreeForm initialData={course} courseId={course.id} />
              {!course.isFree && (
                <PriceForm initialData={course} courseId={course.id} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl font-bold text-slate-800">TPs, Examens & Documents PDF</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;