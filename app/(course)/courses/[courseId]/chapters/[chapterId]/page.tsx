import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { File, FileText, Download, CheckCircle2, Sparkles, BookOpen } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { db } from "@/lib/db";

import { VideoPlayer } from "./_components/video-player";
import { PdfDocumentViewer } from "./_components/pdf-document-viewer";
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

  // Determine if main content is PDF or Video
  const isVideo = !!(muxData?.playbackId || (chapter.videoUrl && (chapter.videoUrl.includes("youtube") || chapter.videoUrl.includes("vimeo") || chapter.videoUrl.endsWith(".mp4"))));

  // Find primary PDF URL
  const pdfAttachment = attachments.find(a => a.type === "COURSE_PDF" || a.url.toLowerCase().endsWith(".pdf"));
  const primaryPdfUrl = (!isVideo && chapter.videoUrl) ? chapter.videoUrl : pdfAttachment?.url || attachments[0]?.url;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "COURSE_PDF":
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded ml-auto border border-purple-200">Cours PDF</span>;
      case "TP_SUJET":
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded ml-auto border border-amber-200">TP Sujet</span>;
      case "TP_CORRIGE":
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded ml-auto border border-emerald-200">TP Corrigé</span>;
      case "EFM_EXAM":
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded ml-auto border border-purple-200">EFM Exam</span>;
      default:
        return <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded ml-auto border border-slate-300">Document</span>;
    }
  };

  return (
    <div className="font-sans">
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="Vous avez déjà terminé ce chapitre."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="Ce chapitre est réservé aux stagiaires inscrits à ce module."
        />
      )}

      <div className="flex flex-col max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
        
        {/* Main Content Area: PDF Document Reader (Default) or Video Player */}
        {isVideo ? (
          <div className="space-y-6">
            <VideoPlayer
              chapterId={chapterId}
              title={chapter.title}
              courseId={courseId}
              nextChapterId={nextChapter?.id}
              playbackId={muxData?.playbackId || ""}
              isLocked={isLocked}
              completeOnEnd={false}
              videoUrl={chapter.videoUrl}
            />

            {primaryPdfUrl && (
              <PdfDocumentViewer
                pdfUrl={primaryPdfUrl}
                title={`Support PDF - ${chapter.title}`}
                moduleCode={course.moduleCode}
                isLocked={isLocked}
                isCompleted={!!userProgress?.isCompleted}
              />
            )}
          </div>
        ) : (
          <PdfDocumentViewer
            pdfUrl={primaryPdfUrl}
            title={chapter.title}
            moduleCode={course.moduleCode}
            isLocked={isLocked}
            isCompleted={!!userProgress?.isCompleted}
          />
        )}

        {/* Chapter Details & Progress Actions Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200/80 mb-2">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{course.moduleCode ? `Module ${course.moduleCode}` : "Module OFPPT"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {chapter.title}
              </h1>
            </div>

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

          {/* Chapter Text Description / Retranscription */}
          {chapter.description && (
            <>
              <Separator />
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Notes & Points Clés du Cours :
                </h3>
                <div className="prose max-w-none text-sm text-slate-700 leading-relaxed font-normal">
                  <Preview value={chapter.description} />
                </div>
              </div>
            </>
          )}

          {/* Attachments / TPs & Corrigés PDF List */}
          {!!attachments.length && (
            <>
              <Separator />
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-700" />
                  <h3 className="text-sm font-extrabold text-slate-900">
                    TPs, Exercices & Documents PDF ({attachments.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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