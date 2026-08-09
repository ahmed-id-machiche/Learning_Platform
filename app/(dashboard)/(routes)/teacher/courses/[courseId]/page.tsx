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
import { CategoryForm } from "./_components/category-form";
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
    return redirect("/");
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

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const submissions = await db.tpSubmission.findMany({
    where: {
      courseId: courseId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const chaptersMap = course.chapters.reduce((acc, chapter) => {
    acc[chapter.id] = chapter.title;
    return acc;
  }, {} as Record<string, string>);

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields} éléments configurés)`;

  // Allow formateur to publish freely as long as title exists
  const isComplete = !!course.title;

  return (
    <>
      {!course.isPublished && (
        <Banner label="Ce module n'est pas encore publié. Il ne sera pas visible par les étudiants." />
      )}
      <div className="p-6 space-y-6">
        <Breadcrumbs
          items={[
            { label: "Modules de Formation", href: "/teacher/courses" },
            { label: course.moduleCode ? `[${course.moduleCode}] ${course.title}` : course.title },
          ]}
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <h1 className="text-2xl font-bold text-slate-900">Configuration du Module OFPPT</h1>
            <span className="text-sm text-slate-600 font-medium">
              {course.title ? "Prêt à être publié" : "Veuillez configurer au moins l'intitulé"} - {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl font-bold text-slate-800">Informations du Module OFPPT</h2>
            </div>
            <ModuleCodeForm initialData={course} courseId={course.id} />
            <TitleForm initialData={course} courseId={course.id} />
            <FiliereForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
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
                <h2 className="text-xl font-bold text-slate-800">Accès & Inscription</h2>
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