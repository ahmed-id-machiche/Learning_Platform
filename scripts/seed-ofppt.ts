import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("Seeding OFPPT Filières & Course Covers...");

    // 1. Seed Official OFPPT Filières as Categories
    const categoriesData = [
      { name: "1ère Année TSGE" },
      { name: "1ère Année TAA" },
      { name: "TSGE CF" },
      { name: "TSGE CM" },
      { name: "TSGE OM" },
      { name: "TSGE RH" },
      { name: "TAA Comptabilité" },
      { name: "TAA Gestion" },
    ];

    for (const cat of categoriesData) {
      await db.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat,
      });
    }

    const categories = await db.category.findMany();
    const catMap = new Map(categories.map((c) => [c.name, c.id]));

    // 2. Update existing modules to exact filières and default images
    const dummyUserId = "user_ofppt_teacher_01";

    const coursesData = [
      // 1ère Année TSGE
      {
        title: "M101: Métier et Démarche de Formation (TSGE & TAA)",
        moduleCode: "M101",
        filiere: "1ère Année TSGE",
        niveau: "1ère Année",
        description: "Comprendre les exigences du secteur tertiaire, l'organisation de l'OFPPT et la démarche d'apprentissage professionnelle.",
        imageUrl: "/images/filiere-courses/tsge-1ere-annee.jpg",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("1ère Année TSGE"),
      },
      {
        title: "M102: Comptabilité Générale - Fondamentaux",
        moduleCode: "M102",
        filiere: "1ère Année TSGE",
        niveau: "1ère Année",
        description: "Maîtriser les principes fondamentaux du Bilan, du CPC, des écritures comptables et du journal selon le Plan Comptable Général Marocain (CGNC).",
        imageUrl: "/images/filiere-courses/tsge-1ere-annee.jpg",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("1ère Année TSGE"),
      },
      // 1ère Année TAA
      {
        title: "M103: Secrétariat & Bureautique Administrative (TAA)",
        moduleCode: "M103",
        filiere: "1ère Année TAA",
        niveau: "1ère Année",
        description: "Gestion des appels, organisation du courrier, traitement de texte Word & Excel pour assistants administratifs.",
        imageUrl: "/images/filiere-courses/taa-1ere-annee.jpg",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("1ère Année TAA"),
      },
      // TSGE CF
      {
        title: "M201: Comptabilité Approfondie & Fiscalité (TSGE-CF)",
        moduleCode: "M201",
        filiere: "TSGE CF",
        niveau: "2ème Année",
        description: "Diagnostic financier, fiscalité de l'entreprise (IS, TVA, IR) et comptabilité de clôture des travaux de fin d'exercice.",
        imageUrl: "/images/filiere-courses/tsge-cf.jpg",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("TSGE CF"),
      },
      // TSGE CM
      {
        title: "M202: Marketing Stratégique & Force de Vente (TSGE-CM)",
        moduleCode: "M202",
        filiere: "TSGE CM",
        niveau: "2ème Année",
        description: "Stratégie de prospection, négociation commerciale, gestion de la relation client (CRM) et études de marché.",
        imageUrl: "/images/filiere-courses/tsge-cm.jpg",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("TSGE CM"),
      },
      // TSGE OM
      {
        title: "M203: Assistanat de Direction & Office Manager (TSGE-OM)",
        moduleCode: "M203",
        filiere: "TSGE OM",
        niveau: "2ème Année",
        description: "Organisation de réunions de direction, gestion des agendas complexes, rédaction de comptes-rendus et suivi des budgets de service.",
        imageUrl: "/images/filiere-courses/tsge-om.jpg",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("TSGE OM"),
      },
      // TSGE RH
      {
        title: "M204: Gestion du Personnel & Droit Social (TSGE-RH)",
        moduleCode: "M204",
        filiere: "TSGE RH",
        niveau: "2ème Année",
        description: "Traitement de la paie, contrats de travail, gestion prévisionnelle des emplois (GPEC) et législation sociale marocaine.",
        imageUrl: "/images/filiere-courses/tsge-rh.jpg",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("TSGE RH"),
      },
      // TAA Comptabilité
      {
        title: "M205: Travaux de Fin d'Exercice & Paie (TAA-Comptabilité)",
        moduleCode: "M205",
        filiere: "TAA Comptabilité",
        niveau: "2ème Année",
        description: "Pratique de la comptabilité courante, travaux d'inventaire et préparation des bulletins de paie pour assistants comptables.",
        imageUrl: "/images/filiere-courses/taa-comptabilite.jpg",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("TAA Comptabilité"),
      },
      // TAA Gestion
      {
        title: "M206: Gestion Administrative & Stocks (TAA-Gestion)",
        moduleCode: "M206",
        filiere: "TAA Gestion",
        niveau: "2ème Année",
        description: "Suivi des approvisionnements, gestion des bons de commande/livraison et administration des ventes en entreprise.",
        imageUrl: "/images/filiere-courses/taa-gestion.jpg",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("TAA Gestion"),
      },
    ];

    for (const c of coursesData) {
      const existingCourse = await db.course.findFirst({
        where: {
          OR: [
            { title: { contains: c.moduleCode } },
            { moduleCode: c.moduleCode },
          ],
        },
      });

      if (existingCourse) {
        await db.course.update({
          where: { id: existingCourse.id },
          data: {
            filiere: c.filiere,
            niveau: c.niveau,
            imageUrl: c.imageUrl,
            categoryId: c.categoryId,
          },
        });
      }
    }

    console.log("OFPPT Filières and modules updated successfully!");
  } catch (error) {
    console.error("Error seeding OFPPT modules:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
