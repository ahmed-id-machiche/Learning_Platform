import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, description, chapterId, questions } = await req.json();

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const quiz = await db.quiz.create({
      data: {
        title: title || `QCM - ${new Date().toLocaleDateString("fr-FR")}`,
        description: description || "Examen QCM généré par l'IA",
        courseId,
        chapterId: chapterId || null,
        isPublished: true,
        questions: {
          create: questions.map(
            (
              q: {
                question: string;
                explanation?: string;
                options: { text: string; isCorrect: boolean }[];
              },
              index: number
            ) => ({
              question: q.question,
              explanation: q.explanation || null,
              position: index + 1,
              options: {
                create: q.options.map((opt) => ({
                  text: opt.text,
                  isCorrect: opt.isCorrect,
                })),
              },
            })
          ),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("[QUIZZES_POST]", error);
    return new NextResponse("Erreur interne lors de la sauvegarde du QCM", {
      status: 500,
    });
  }
}
