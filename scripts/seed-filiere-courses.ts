import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("Seeding OFPPT filière courses with working video URLs...");

    // 1. Ensure categories exist
    const categoriesData = [
      { name: "Développement Digital" },
      { name: "Infrastructure Digitale & Réseaux" },
      { name: "Gestion des Entreprises" },
      { name: "Commerce Digital & Marketing" },
      { name: "Comptabilité & Finance" },
      { name: "Intelligence Artificielle & Data" },
      { name: "CyberSécurité & Systèmes" },
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

    const existingTeacherCourse = await db.course.findFirst();
    const teacherUserId = existingTeacherCourse?.userId || "user_ofppt_teacher_01";

    const coursesToSeed = [
      // 1. Développement Digital (Free)
      {
        title: "Développement Web Front-End Moderne (React & Tailwind)",
        moduleCode: "M101",
        filiere: "Développement Digital",
        niveau: "Technicien Spécialisé",
        description: "Maîtrisez la création d'interfaces web dynamiques, réactives et modernes avec HTML5, CSS3, JavaScript ES6, React.js et Tailwind CSS.",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        price: null,
        categoryName: "Développement Digital",
        chapters: [
          { title: "Chapitre 1: Fondamentaux HTML5, CSS3 & Flexbox/Grid", videoUrl: "https://www.youtube.com/watch?v=mU6anWqZJcc", position: 1, isPublished: true },
          { title: "Chapitre 2: JavaScript Moderne ES6+ et Asynchronisme (Promises, Async/Await)", videoUrl: "https://www.youtube.com/watch?v=hdI2bqOjy3c", position: 2, isPublished: true },
          { title: "Chapitre 3: Initialisation React.js, Components, Props & Hooks State", videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8", position: 3, isPublished: true },
        ],
      },

      // 2. Infrastructure Digitale (Free)
      {
        title: "Administration Réseaux & Services Cloud (Cisco & Linux)",
        moduleCode: "M102",
        filiere: "Infrastructure Digitale",
        niveau: "Technicien Spécialisé",
        description: "Conception, configuration et sécurisation des réseaux d'entreprise Cisco CCNA, routage IP, VLANs et administration de serveurs Linux RedHat.",
        imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        price: null,
        categoryName: "Infrastructure Digitale & Réseaux",
        chapters: [
          { title: "Chapitre 1: Modèle OSI, Adressage IPv4/IPv6 et Sous-réseaux", videoUrl: "https://www.youtube.com/watch?v=H8W9oMNSuwo", position: 1, isPublished: true },
          { title: "Chapitre 2: Commutation Cisco, VLANs et Trunking IEEE 802.1Q", videoUrl: "https://www.youtube.com/watch?v=L3ZzkO1-kW8", position: 2, isPublished: true },
          { title: "Chapitre 3: Administration Serveur Linux, SSH et Services DNS/DHCP", videoUrl: "https://www.youtube.com/watch?v=wBp0Rb-ZJak", position: 3, isPublished: true },
        ],
      },

      // 3. Gestion des Entreprises (Free)
      {
        title: "Management Opérationnel & Stratégie d'Entreprise",
        moduleCode: "M103",
        filiere: "Gestion des Entreprises",
        niveau: "Technicien Spécialisé",
        description: "Organiser les structures d'entreprise, élaborer le diagnostic stratégique (SWOT/PESTEL) et piloter la performance opérationnelle.",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        price: null,
        categoryName: "Gestion des Entreprises",
        chapters: [
          { title: "Chapitre 1: Les structures organisationnelles et la gouvernance", videoUrl: "https://www.youtube.com/watch?v=3g83_L_m0_8", position: 1, isPublished: true },
          { title: "Chapitre 2: Diagnostic stratégique SWOT, PESTEL et 5 Forces de Porter", videoUrl: "https://www.youtube.com/watch?v=0h62pX4P_0E", position: 2, isPublished: true },
          { title: "Chapitre 3: Tableaux de bord de gestion et indicateurs KPI", videoUrl: "https://www.youtube.com/watch?v=L3ZzkO1-kW8", position: 3, isPublished: true },
        ],
      },

      // 4. Commerce Digital & Marketing (Free)
      {
        title: "E-Commerce, Social Media Ads & Conversion",
        moduleCode: "M104",
        filiere: "Commerce Digital",
        niveau: "Technicien Spécialisé",
        description: "Lancement de boutiques en ligne, création de campagnes Meta Ads / Google Ads ciblées et optimisation des tunnels de vente.",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0a67daf4005a?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        price: null,
        categoryName: "Commerce Digital & Marketing",
        chapters: [
          { title: "Chapitre 1: Stratégie de vente en ligne et choix des plateformes", videoUrl: "https://www.youtube.com/watch?v=0h62pX4P_0E", position: 1, isPublished: true },
          { title: "Chapitre 2: Configuration des campagnes publicitaires Facebook & Instagram Ads", videoUrl: "https://www.youtube.com/watch?v=mU6anWqZJcc", position: 2, isPublished: true },
          { title: "Chapitre 3: Copywriting, Référencement SEO et Tunnels de Conversion", videoUrl: "https://www.youtube.com/watch?v=hdI2bqOjy3c", position: 3, isPublished: true },
        ],
      },

      // 5. Comptabilité & Finance (Free)
      {
        title: "Analyse Financière & Comptabilité Analytique",
        moduleCode: "M105",
        filiere: "Comptabilité & Finance",
        niveau: "Technicien Spécialisé",
        description: "Étude des soldes intermédiaires de gestion (SIG), calcul du fonds de roulement (FRNG) et calcul des coûts de revient selon le CGNC marocain.",
        imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: true,
        price: null,
        categoryName: "Comptabilité & Finance",
        chapters: [
          { title: "Chapitre 1: État des Soldes de Gestion (ESG) et Bilan Financier", videoUrl: "https://www.youtube.com/watch?v=p4U-B31g84o", position: 1, isPublished: true },
          { title: "Chapitre 2: Calcul du FRNG, BFR et de la Trésorerie Nette", videoUrl: "https://www.youtube.com/watch?v=3g83_L_m0_8", position: 2, isPublished: true },
          { title: "Chapitre 3: Comptabilité Analytique et Coûts de Revient", videoUrl: "https://www.youtube.com/watch?v=0h62pX4P_0E", position: 3, isPublished: true },
        ],
      },

      // 6. 💰 PAID COURSE 1: Intelligence Artificielle & Data Science (PAYANT: 250 MAD)
      {
        title: "Masterclass IA Pratique, Python & Machine Learning",
        moduleCode: "M201-PRO",
        filiere: "Intelligence Artificielle & Data",
        niveau: "Masterclass Pro",
        description: "Formation certifiante payante réservée aux abonnés : Apprentissage automatique avec Python, Pandas, Scikit-Learn et modèles de Deep Learning.",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: false,
        price: 250,
        categoryName: "Intelligence Artificielle & Data",
        chapters: [
          { title: "Chapitre 1: Traitement et Nettoyage de Données avec Pandas & NumPy", videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw", position: 1, isPublished: true },
          { title: "Chapitre 2: Algorithmes de Régression et Classification Scikit-Learn", videoUrl: "https://www.youtube.com/watch?v=7eh4d6sabA0", position: 2, isPublished: true },
          { title: "Chapitre 3: Introduction aux Réseaux de Neurones et Computer Vision", videoUrl: "https://www.youtube.com/watch?v=aircAruvnKk", position: 3, isPublished: true },
        ],
      },

      // 7. 💰 PAID COURSE 2: CyberSécurité & Hacking Éthique (PAYANT: 350 MAD)
      {
        title: "Bootcamp CyberSécurité, Hacking Éthique & Audit Systèmes",
        moduleCode: "M202-PRO",
        filiere: "CyberSécurité & Systèmes",
        niveau: "Masterclass Pro",
        description: "Formation avancée réservée sur accès payant : Tests d'intrusion (PenTesting), analyse des vulnérabilités OWASP Top 10 et sécurisation réseau.",
        imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
        isPublished: true,
        isFree: false,
        price: 350,
        categoryName: "CyberSécurité & Systèmes",
        chapters: [
          { title: "Chapitre 1: Méthodologie du PenTesting et Reconnaissance (Nmap, Wireshark)", videoUrl: "https://www.youtube.com/watch?v=3Kq1MIfTWCE", position: 1, isPublished: true },
          { title: "Chapitre 2: Vulnérabilités Web OWASP Top 10 (Injection SQL, XSS, CSRF)", videoUrl: "https://www.youtube.com/watch?v=F5fLqW2F2qM", position: 2, isPublished: true },
          { title: "Chapitre 3: Hardening Serveurs Linux/Windows et Sécurisation Réseau", videoUrl: "https://www.youtube.com/watch?v=inWWhr5tnEA", position: 3, isPublished: true },
        ],
      },
    ];

    for (const c of coursesToSeed) {
      const categoryId = catMap.get(c.categoryName);

      let course = await db.course.findFirst({
        where: { title: c.title },
      });

      if (!course) {
        course = await db.course.create({
          data: {
            userId: teacherUserId,
            title: c.title,
            moduleCode: c.moduleCode,
            filiere: c.filiere,
            niveau: c.niveau,
            description: c.description,
            imageUrl: c.imageUrl,
            isPublished: c.isPublished,
            isFree: c.isFree,
            price: c.price,
            categoryId,
          },
        });
      }

      // Upsert chapters with video URLs
      for (const ch of c.chapters) {
        const existingChap = await db.chapter.findFirst({
          where: { courseId: course.id, title: ch.title },
        });

        if (!existingChap) {
          await db.chapter.create({
            data: {
              courseId: course.id,
              title: ch.title,
              videoUrl: ch.videoUrl,
              position: ch.position,
              isPublished: ch.isPublished,
            },
          });
        } else {
          await db.chapter.update({
            where: { id: existingChap.id },
            data: { videoUrl: ch.videoUrl },
          });
        }
      }
      console.log(`Updated course with working video URLs: ${c.title}`);
    }

    // Also update any other published chapters without videoUrl with default working YouTube video
    const defaultVideoUrl = "https://www.youtube.com/watch?v=hdI2bqOjy3c";
    await db.chapter.updateMany({
      where: { videoUrl: null },
      data: { videoUrl: defaultVideoUrl },
    });

    console.log("\nAll chapters updated with active video streams successfully!");
  } catch (error) {
    console.error("Error seeding video URLs:", error);
  } finally {
    await db.$disconnect();
    await pool.end();
  }
}

main();
