import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("Seeding OFPPT Commerce & Gestion Categories & Modules...");

    // 1. Seed Commerce & Gestion Categories
    const categoriesData = [
      { name: "Gestion des Entreprises" },
      { name: "Commerce Digital & Marketing" },
      { name: "Comptabilité & Finance" },
      { name: "Logistique & Transport" },
      { name: "Techniques de Vente" },
      { name: "Administration & RH" },
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

    // 2. Seed OFPPT Courses for Commerce & Gestion
    const dummyUserId = "user_ofppt_teacher_01"; // Generic teacher ID

    const coursesData = [
      // --- 1ère Année TSGE & TAA Tronc Commun ---
      {
        title: "M101: Métier et Démarche de Formation (TSGE & TAA)",
        moduleCode: "M101",
        filiere: "TSGE Tronc Commun",
        niveau: "1ère Année",
        description: "Comprendre les exigences du secteur tertiaire, l'organisation de l'OFPPT et la démarche d'apprentissage professionnelle.",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Gestion des Entreprises"),
        chapters: [
          { title: "Chapitre 1: Présentation du secteur Tertiaire et OFPPT", position: 1, isPublished: true },
          { title: "Chapitre 2: Analyse des compétences requises en entreprise", position: 2, isPublished: true },
          { title: "Chapitre 3: Projet professionnel et méthode de travail", position: 3, isPublished: true },
        ],
      },
      {
        title: "M102: Comptabilité Générale - Fondamentaux",
        moduleCode: "M102",
        filiere: "TSGE Tronc Commun",
        niveau: "1ère Année",
        description: "Maîtriser les principes fondamentaux du Bilan, du CPC, des écritures comptables et du journal selon le Plan Comptable Général Marocain (CGNC).",
        imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Comptabilité & Finance"),
        chapters: [
          { title: "Chapitre 1: Le Bilan et le Compte de Produits et Charges (CPC)", position: 1, isPublished: true },
          { title: "Chapitre 2: L'analyse des comptes et la comptabilité en partie double", position: 2, isPublished: true },
          { title: "Chapitre 3: Enregistrement au Journal et Grand Livre", position: 3, isPublished: true },
        ],
      },
      {
        title: "M103: Secrétariat & Bureautique Administrative (TAA)",
        moduleCode: "M103-TAA",
        filiere: "TAA Tronc Commun",
        niveau: "1ère Année",
        description: "Gestion des appels, organisation du courrier, traitement de texte Word & Excel pour assistants administratifs.",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Administration & RH"),
        chapters: [
          { title: "Chapitre 1: Accueil et Communication Téléphonique", position: 1, isPublished: true },
          { title: "Chapitre 2: Gestion du courrier et classement documentaire", position: 2, isPublished: true },
          { title: "Chapitre 3: Bureautique essentielle Word & Excel", position: 3, isPublished: true },
        ],
      },

      // --- 2ème Année TSGE Options ---
      {
        title: "M201: Comptabilité Approfondie & Fiscalité (TSGE-CF)",
        moduleCode: "M201",
        filiere: "TSGE - CF",
        niveau: "2ème Année",
        description: "Diagnostic financier, fiscalité de l'entreprise (IS, TVA, IR) et comptabilité de clôture des travaux de fin d'exercice.",
        imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Comptabilité & Finance"),
        chapters: [
          { title: "Chapitre 1: Déclarations et Calcul de la TVA & Impôts", position: 1, isPublished: true },
          { title: "Chapitre 2: Amortissements et Provisions pour dépréciation", position: 2, isPublished: true },
          { title: "Chapitre 3: Bilan Financier et Diagnostic des SIG", position: 3, isPublished: true },
        ],
      },
      {
        title: "M202: Marketing Stratégique & Force de Vente (TSGE-CM)",
        moduleCode: "M202",
        filiere: "TSGE - CM",
        niveau: "2ème Année",
        description: "Stratégie de prospection, négociation commerciale, gestion de la relation client (CRM) et études de marché.",
        imageUrl: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Commerce Digital & Marketing"),
        chapters: [
          { title: "Chapitre 1: Stratégie de Prospection & Négociation", position: 1, isPublished: true },
          { title: "Chapitre 2: Fidélisation Client & Outils CRM", position: 2, isPublished: true },
        ],
      },
      {
        title: "M203: Assistanat de Direction & Office Manager (TSGE-OM)",
        moduleCode: "M203",
        filiere: "TSGE - OM",
        niveau: "2ème Année",
        description: "Organisation de réunions de direction, gestion des agendas complexes, rédaction de comptes-rendus et suivi des budgets de service.",
        imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Administration & RH"),
        chapters: [
          { title: "Chapitre 1: Organisation des Réunions et Événements", position: 1, isPublished: true },
          { title: "Chapitre 2: Rédaction Administrative Avancée", position: 2, isPublished: true },
        ],
      },
      {
        title: "M204: Gestion du Personnel & Droit Social (TSGE-RH)",
        moduleCode: "M204",
        filiere: "TSGE - RH",
        niveau: "2ème Année",
        description: "Traitement de la paie, contrats de travail, gestion prévisionnelle des emplois (GPEC) et législation sociale marocaine.",
        imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Administration & RH"),
        chapters: [
          { title: "Chapitre 1: Calcul des Salaires et Bulletin de Paie", position: 1, isPublished: true },
          { title: "Chapitre 2: Recrutement & Évaluation des Compétences", position: 2, isPublished: true },
        ],
      },

      // --- 2ème Année TAA Options ---
      {
        title: "M205: Travaux de Fin d'Exercice & Paie (TAA-Comptabilité)",
        moduleCode: "M205",
        filiere: "TAA - Comptabilité",
        niveau: "2ème Année",
        description: "Pratique de la comptabilité courante, travaux d'inventaire et préparation des bulletins de paie pour assistants comptables.",
        imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Comptabilité & Finance"),
        chapters: [
          { title: "Chapitre 1: Saisie des Factures et Journaux Auxiliaires", position: 1, isPublished: true },
          { title: "Chapitre 2: Déclaration des Charges Sociales & Paie", position: 2, isPublished: true },
        ],
      },
      {
        title: "M206: Gestion Administrative & Stocks (TAA-Gestion)",
        moduleCode: "M206",
        filiere: "TAA - Gestion",
        niveau: "2ème Année",
        description: "Suivi des approvisionnements, gestion des bons de commande/livraison et administration des ventes en entreprise.",
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Gestion des Entreprises"),
        chapters: [
          { title: "Chapitre 1: Suivi des Commandes et Bons de Livraison", position: 1, isPublished: true },
          { title: "Chapitre 2: Gestion des Inventaires et Stocks", position: 2, isPublished: true },
        ],
      },
    ];

    for (const c of coursesData) {
      const existingCourse = await db.course.findFirst({
        where: { title: c.title },
      });

      if (!existingCourse) {
        await db.course.create({
          data: {
            userId: dummyUserId,
            title: c.title,
            moduleCode: c.moduleCode,
            filiere: c.filiere,
            niveau: c.niveau,
            description: c.description,
            imageUrl: c.imageUrl,
            isPublished: c.isPublished,
            isFree: c.isFree,
            categoryId: c.categoryId,
            chapters: {
              create: c.chapters,
            },
          },
        });
      } else {
        await db.course.update({
          where: { id: existingCourse.id },
          data: {
            imageUrl: c.imageUrl,
          },
        });
      }
    }

    console.log("OFPPT Commerce & Gestion modules seeded successfully!");
  } catch (error) {
    console.error("Error seeding OFPPT modules:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
