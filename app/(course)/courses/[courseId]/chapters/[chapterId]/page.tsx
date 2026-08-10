import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { db } from "@/lib/db";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { CourseProgressButton } from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
  searchParams: Promise<{ success?: string }>;
}) => {
  const { userId } = await auth();
  const { courseId, chapterId } = await params;
  const { success } = await searchParams;

  if (!userId) {
    return redirect("/sign-in");
  }

  // Auto-grant access if returning from Stripe Checkout success
  if (success === "1" || success === "true") {
    try {
      await db.purchase.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        update: {},
        create: {
          userId,
          courseId,
        },
      });
    } catch (e) {
      console.log("[STRIPE_RETURN_AUTO_ENROLL_ERROR]", e);
    }
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId,
    courseId,
  });

  if (!chapter || !course) {
    return redirect("/search");
  }

  const hasAccess = course.isFree || !!purchase || success === "1" || success === "true";
  const isLocked = !chapter.isFree && !hasAccess;
  const completeOnEnd = hasAccess && !userProgress?.isCompleted;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "COURSE_PDF":
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded ml-auto">Cours PDF</span>;
      case "TP_SUJET":
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded ml-auto">TP Sujet</span>;
      case "TP_CORRIGE":
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded ml-auto">TP Corrigé</span>;
      case "EFM_EXAM":
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded ml-auto">EFM Exam</span>;
      default:
        return <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded ml-auto">Doc</span>;
    }
  };

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="Vous avez déjà terminé ce chapitre."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="Ce chapitre est réservé aux personnes inscrites à ce module."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId || ""}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            videoUrl={chapter.videoUrl}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {hasAccess ? (
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={courseId}
                price={course.price || 0}
              />
            )}
          </div>
          <Separator />
          <div className="p-4 font-normal text-slate-700">
            {chapter.description ? (
              <Preview value={chapter.description} />
            ) : null}
          </div>

          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                <div className="font-medium text-lg mb-2">TPs, Exams & Documents OFPPT</div>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <PdfDownloadButton
                      key={attachment.id}
                      url={attachment.url}
                      name={attachment.name}
                      variant="list"
                      badge={getTypeBadge(attachment.type)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;