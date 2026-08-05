import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("Seeding sample EFMs and TPs Corrigés attachments...");

    const courses = await db.course.findMany();
    if (courses.length === 0) {
      console.log("No courses found to attach resources.");
      return;
    }

    const sampleResources = [
      // M101
      {
        courseCode: "M101",
        attachments: [
          {
            name: "EFM Régional 2025 - Métier et Démarche de Formation (Sujet + Corrigé).pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "EFM_EXAM" as const,
          },
          {
            name: "TP 01 - Analyse des Compétences et Secteur Tertiaire (Corrigé).pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "TP_CORRIGE" as const,
          },
          {
            name: "Guide Pédagogique M101 - Support de Cours Officiel OFPPT.pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "COURSE_PDF" as const,
          },
        ],
      },
      // M102
      {
        courseCode: "M102",
        attachments: [
          {
            name: "EFM National 2025 - Comptabilité Générale (Épreuve Complète + Barème).pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "EFM_EXAM" as const,
          },
          {
            name: "TP 02 - Établissement du Bilan et du CPC (Sujet + Corrigé Détaillé).pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "TP_CORRIGE" as const,
          },
          {
            name: "Sujet TP 03 - Enregistrement des Écritures au Journal et Grand Livre.pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "TP_SUJET" as const,
          },
          {
            name: "Plan Comptable Général Marocain (CGNC - Résumé Officiel).pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "COURSE_PDF" as const,
          },
        ],
      },
      // M103
      {
        courseCode: "M103",
        attachments: [
          {
            name: "EFM Régional 2024 - Marketing & Stratégie Commerciale (Corrigé).pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "EFM_EXAM" as const,
          },
          {
            name: "TP Case Study - Étude de Marché et Segmentation Client (Corrigé).pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "TP_CORRIGE" as const,
          },
        ],
      },
      // M104
      {
        courseCode: "M104",
        attachments: [
          {
            name: "EFM 2025 - Droit des Affaires & Code du Travail (Sujet + Corrigé).pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "EFM_EXAM" as const,
          },
          {
            name: "TP 01 - Rédaction des Contrats de Travail (Modèles & Corrigé).pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "TP_CORRIGE" as const,
          },
        ],
      },
      // M105
      {
        courseCode: "M105",
        attachments: [
          {
            name: "EFM Régional 2025 - Commerce International & Incoterms 2020 (Corrigé).pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "EFM_EXAM" as const,
          },
          {
            name: "Guide Pratique Incoterms 2020 - OFPPT Logistique.pdf",
            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            type: "COURSE_PDF" as const,
          },
        ],
      },
    ];

    for (const resGroup of sampleResources) {
      const course = courses.find((c) => c.moduleCode === resGroup.courseCode || c.title.includes(resGroup.courseCode));
      if (course) {
        for (const att of resGroup.attachments) {
          const existing = await db.attachment.findFirst({
            where: { name: att.name, courseId: course.id },
          });

          if (!existing) {
            await db.attachment.create({
              data: {
                name: att.name,
                url: att.url,
                type: att.type,
                courseId: course.id,
              },
            });
          }
        }
      }
    }

    console.log("Sample EFMs and TPs Corrigés seeded successfully!");
  } catch (error) {
    console.error("Error seeding resources:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
