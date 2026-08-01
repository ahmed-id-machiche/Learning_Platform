import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TeacherSubmissionsClient } from "./_components/teacher-submissions-client";

const SubmissionsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const teacherCourses = await db.course.findMany({
    where: {
      userId,
    },
    include: {
      chapters: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  const teacherCourseIds = teacherCourses.map((c) => c.id);

  const submissions = await db.tpSubmission.findMany({
    where: {
      courseId: {
        in: teacherCourseIds,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const courseMap: Record<string, string> = {};
  const chapterMap: Record<string, string> = {};

  teacherCourses.forEach((course) => {
    courseMap[course.id] = course.moduleCode ? `[${course.moduleCode}] ${course.title}` : course.title;
    course.chapters.forEach((chapter) => {
      chapterMap[chapter.id] = chapter.title;
    });
  });

  const submissionUserIds = Array.from(new Set(submissions.map((s) => s.userId)));
  const userMap: Record<string, { name: string; email: string }> = {};

  if (submissionUserIds.length > 0) {
    try {
      const client = await clerkClient();
      const usersResponse = await client.users.getUserList({
        userId: submissionUserIds,
      });
      usersResponse.data.forEach((u) => {
        const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
        const primaryEmail =
          u.emailAddresses?.find((e) => e.id === u.primaryEmailAddressId)
            ?.emailAddress || u.emailAddresses[0]?.emailAddress || "";
        userMap[u.id] = {
          name: fullName || u.username || (primaryEmail ? primaryEmail.split("@")[0] : "Stagiaire"),
          email: primaryEmail,
        };
      });
    } catch (e) {
      console.log("Error fetching Clerk users:", e);
    }
  }

  const formattedSubmissions = submissions.map((sub) => ({
    ...sub,
    courseTitle: courseMap[sub.courseId] || "Module OFPPT",
    chapterTitle: chapterMap[sub.chapterId] || "Chapitre",
    studentName: userMap[sub.userId]?.name || `Stagiaire (${sub.userId.substring(0, 6)})`,
    studentEmail: userMap[sub.userId]?.email || "",
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Submissions des TPs & Devoirs Stagiaires
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gérez l'ensemble des travaux pratiques soumis par vos stagiaires et attribuez les notes.
        </p>
      </div>

      <TeacherSubmissionsClient submissions={formattedSubmissions} />
    </div>
  );
};

export default SubmissionsPage;
