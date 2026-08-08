import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterActions } from "./_components/chapter-actions";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { ChapterAttachmentForm } from "./_components/chapter-attachment-form";

const ChapterIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) => {
  const { userId } = await auth();
  const { courseId, chapterId } = await params;

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  let attachments: any[] = [];
  try {
    attachments = await db.attachment.findMany({
      where: {
        chapterId: chapterId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.log("[CHAPTER_ATTACHMENTS_FETCH]", error);
  }

  // Publishing requires at least a chapter title (video & description are optional)
  const isComplete = !!chapter.title;

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="Ce chapitre n'est pas encore publié. Il ne sera pas visible par les étudiants."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${courseId}`}
              className="flex items-center text-sm font-semibold text-slate-600 hover:text-sky-700 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au module
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-1">
                <h1 className="text-2xl font-bold text-slate-900">Configuration du Chapitre</h1>
                <span className="text-sm text-slate-600 font-medium">
                  {chapter.title ? "Prêt à être publié (Titre configuré)" : "Veuillez renseigner le titre du chapitre"}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl font-bold text-slate-800">Informations du Chapitre</h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl font-bold text-slate-800">Paramètres d'Accès & Aperçu</h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-xl font-bold text-slate-800">Vidéo du Cours (Optionnel)</h2>
              </div>
              <ChapterVideoForm
                initialData={chapter}
                chapterId={chapterId}
                courseId={courseId}
              />
            </div>
            <div>
              <ChapterAttachmentForm
                initialData={{ attachments }}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;