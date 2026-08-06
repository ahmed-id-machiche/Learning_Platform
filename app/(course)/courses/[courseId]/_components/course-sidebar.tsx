import { auth } from "@clerk/nextjs/server";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { CourseProgress } from "@/components/course-progress";

import { CourseSidebarItem } from "./course-sidebar-item";

import { Logo } from "@/components/logo";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-xs">
      <div className="p-6 flex flex-col border-b space-y-4">
        <div className="pb-2 border-b border-slate-100">
          <Logo />
        </div>
        <div className="space-y-1.5">
          {course.moduleCode && (
            <span className="font-mono text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-200 inline-block">
              {course.moduleCode}
            </span>
          )}
          <h1 className="font-bold text-slate-900 text-sm leading-snug">
            {course.title}
          </h1>
        </div>
        {purchase && (
          <div className="pt-2">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};