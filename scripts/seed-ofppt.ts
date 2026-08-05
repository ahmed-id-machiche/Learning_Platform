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
      {
        title: "M101: Métier et Démarche de Formation",
        moduleCode: "M101",
        filiere: "Technicien Spécialisé en Gestion des Entreprises",
        niveau: "Technicien Spécialisé",
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
        title: "M102: Comptabilité Générale - Principes de Base",
        moduleCode: "M102",
        filiere: "Technicien Spécialisé en Comptabilité & Finance",
        niveau: "Technicien Spécialisé",
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
        title: "M103: Marketing & Stratégie Commerciale",
        moduleCode: "M103",
        filiere: "Technicien Spécialisé en Commerce Digital",
        niveau: "Technicien Spécialisé",
        description: "Étude de marché, comportement du consommateur, segmentation, ciblage, positionnement et mix marketing (les 4P).",
        imageUrl: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Commerce Digital & Marketing"),
        chapters: [
          { title: "Chapitre 1: Introduction au Marketing et à l'Étude de Marché", position: 1, isPublished: true },
          { title: "Chapitre 2: Le Comportement de l'Acheteur et la Segmentation", position: 2, isPublished: true },
          { title: "Chapitre 3: Elaboration du Marketing Mix (Produit, Prix, Distribution, Com)", position: 3, isPublished: true },
        ],
      },
      {
        title: "M104: Droit des Affaires & Droit du Travail",
        moduleCode: "M104",
        filiere: "Technicien Spécialisé en Gestion des Entreprises",
        niveau: "Technicien Spécialisé",
        description: "Apprendre les bases juridiques relatives aux sociétés commerciales (SARL, SA), contrats de travail et règles du code du travail marocain.",
        imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Gestion des Entreprises"),
        chapters: [
          { title: "Chapitre 1: Introduction au Droit et statut des Commerçants", position: 1, isPublished: true },
          { title: "Chapitre 2: Le Contrat de Travail et le Code du Travail", position: 2, isPublished: true },
          { title: "Chapitre 3: Les Sociétés Commerciales au Maroc (SARL / SA)", position: 3, isPublished: true },
        ],
      },
      {
        title: "M105: Commerce International & Incoterms",
        moduleCode: "M105",
        filiere: "Technicien Spécialisé en Logistique & Transport",
        niveau: "Technicien Spécialisé",
        description: "Techniques d'exportation et d'importation, règles Incoterms 2020, dédouanement et chaîne logistique internationale.",
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Logistique & Transport"),
        chapters: [
          { title: "Chapitre 1: Les Règles Incoterms 2020", position: 1, isPublished: true },
          { title: "Chapitre 2: Procédures Douanières et Régimes suspensifs", position: 2, isPublished: true },
          { title: "Chapitre 3: Transport International de Marchandises", position: 3, isPublished: true },
        ],
      },
      {
        title: "M106: E-Commerce & Marketing Digital",
        moduleCode: "M106",
        filiere: "Technicien Spécialisé en Commerce Digital",
        niveau: "Technicien Spécialisé",
        description: "Création et gestion de plateformes e-commerce, campagnes publicitaires sur réseaux sociaux, référencement SEO et tunnel de conversion.",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0a67daf4005a?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        categoryId: catMap.get("Commerce Digital & Marketing"),
        chapters: [
          { title: "Chapitre 1: Stratégie de Vente en Ligne & Plateformes", position: 1, isPublished: true },
          { title: "Chapitre 2: Publicité Social Media (Facebook/Instagram/TikTok Ads)", position: 2, isPublished: true },
          { title: "Chapitre 3: Analyse des Conversions et Fidélisation Client", position: 3, isPublished: true },
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
