import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ai } from "@/lib/ai";
import { Type, Schema } from "@google/genai";

const qcmSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          explanation: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                isCorrect: { type: Type.BOOLEAN },
              },
              required: ["text", "isCorrect"],
            },
          },
        },
        required: ["question", "explanation", "options"],
      },
    },
  },
  required: ["title", "questions"],
};

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

    if (!process.env.GEMINI_API_KEY) {
      return new NextResponse(
        "Clé API Gemini manquante. Veuillez ajouter GEMINI_API_KEY dans votre fichier .env",
        { status: 500 }
      );
    }

    const body = await req.json();
    const { chapterId, numQuestions = 5, difficulty = "Moyen", customTopic, pdfBase64, pdfFileName } = body;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
        attachments: true,
      },
    });

    let targetContext = "";
    if (course) {
      targetContext += `Titre du Module: ${course.title}\n`;
      if (course.moduleCode) targetContext += `Code Module: ${course.moduleCode}\n`;
      if (course.description) targetContext += `Description: ${course.description}\n`;

      if (chapterId) {
        const selectedChapter = course.chapters.find((c) => c.id === chapterId);
        if (selectedChapter) {
          targetContext += `\nChapitre Cible: ${selectedChapter.title}\nDescription Chapitre: ${selectedChapter.description || "N/A"}\n`;
        }
      } else {
        targetContext += `\nChapitres du Module:\n` +
          course.chapters.map((c, i) => `${i + 1}. ${c.title}: ${c.description || ""}`).join("\n");
      }
    }

    if (customTopic) {
      targetContext += `\nSujet Spécifique / Consignes Enseignant: ${customTopic}\n`;
    }

    if (pdfFileName) {
      targetContext += `\nFichier PDF Joint Fourni: ${pdfFileName}\n`;
    }

    const prompt = `Vous êtes un professeur expert et concepteur d'examens pédagogiques.
Générez un examen QCM (Questionnaire à Choix Multiples) de ${numQuestions} questions basé strictement sur le contenu du document PDF joint (et du cours).

Niveau de difficulté: ${difficulty}.
Directives:
- Chaque question doit comporter exactement 4 options de réponse (A, B, C, D).
- Une seule option doit être correcte (isCorrect: true).
- Incluez une explication / correction pédagogique détaillée pour chaque question.
- Rédigez l'examen en français clair et professionnel.

${targetContext ? `Contextual Info:\n${targetContext}` : ""}`;

    const contents: any[] = [];

    if (pdfBase64) {
      const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
      contents.push({
        inlineData: {
          mimeType: "application/pdf",
          data: cleanBase64,
        },
      });
    }

    contents.push(prompt);

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: qcmSchema,
      },
    });

    const text = response.text;
    if (!text) {
      return new NextResponse("Erreur lors de la génération par l'IA", { status: 500 });
    }

    const qcmData = JSON.parse(text);
    return NextResponse.json(qcmData);
  } catch (error) {
    console.error("[AI_GENERATE_QCM]", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
