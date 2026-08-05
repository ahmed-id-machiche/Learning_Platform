import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("Seeding sample announcement...");

    const course = await db.course.findFirst({
      where: { moduleCode: "M102" },
    });

    await db.announcement.create({
      data: {
        userId: "user_ofppt_teacher_01",
        title: "📢 Planning du premier EFM Blanc - Comptabilité Générale (M102)",
        content: "Chers stagiaires,\n\nNous vous informons que le premier EFM Blanc aura lieu ce vendredi à 09h00 en salle informatique 3. Merci de réviser les chapitres sur le Bilan et le CPC (CGNC).\n\nBonne préparation à tous !",
        isPinned: true,
        courseId: course ? course.id : null,
      },
    });

    console.log("Sample announcement seeded successfully!");
  } catch (error) {
    console.error("Error seeding announcement:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
