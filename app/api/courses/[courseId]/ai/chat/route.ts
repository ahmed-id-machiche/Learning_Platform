import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ai } from "@/lib/ai";

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

    const { messages, pdfBase64 } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new NextResponse("Messages valides requis", { status: 400 });
    }

    let systemInstruction = "Vous êtes l'assistant IA pédagogique expert pour les enseignants. Aidez l'enseignant à préparer ses cours, expliquer des concepts et répondre à ses questions pédagogiques.";

    if (courseId !== "general") {
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

      if (course) {
        const courseSummary = `
Contextual Course Info:
- Title: ${course.title}
- Module Code: ${course.moduleCode || "N/A"}
- Filiere: ${course.filiere || "N/A"}
- Description: ${course.description || "N/A"}
- Chapters: ${course.chapters.map((c, i) => `${i + 1}. ${c.title} (${c.description || "Sans description"})`).join("; ")}
- Attachments: ${course.attachments.map((a) => a.name).join(", ") || "Aucune pièce jointe"}
`;

        systemInstruction = `Vous êtes l'assistant IA pédagogique de l'enseignant pour le module "${course.title}". 
Vous connaissez parfaitement la structure et le contenu du cours ci-dessous (et des fichiers PDF joints).
Aidez l'enseignant à préparer ses cours, expliquer des concepts, créer des idées d'exercices ou de TP, et répondre à ses questions pédagogiques.
Soyez concis, professionnel, structuré et encourageant.

${courseSummary}`;
      }
    }

    const formattedHistory = messages.map((m: { role: string; content: string }, idx: number) => {
      const parts: any[] = [{ text: m.content }];
      if (idx === messages.length - 1 && pdfBase64) {
        const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
        parts.unshift({
          inlineData: {
            mimeType: "application/pdf",
            data: cleanBase64,
          },
        });
      }
      return {
        role: m.role === "user" ? "user" : "model",
        parts,
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: formattedHistory,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || "Désolé, je n'ai pas pu générer de réponse.";
    return NextResponse.json({ role: "assistant", content: replyText });
  } catch (error) {
    console.error("[AI_CHAT_ERROR]", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
