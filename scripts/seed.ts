import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Développement Digital" },
        { name: "Infrastructure Digitale" },
        { name: "Gestion des Entreprises" },
        { name: "Génie Civil" },
        { name: "Électromécanique" },
        { name: "Réseaux & Télécoms" },
        { name: "Web Development" },
        { name: "Computer Science" },
        { name: "Engineering" },
      ],
      skipDuplicates: true,
    });

    console.log("Categories seeded successfully!");
  } catch (error) {
    console.log("Error seeding database categories", error);
  } finally {
    await db.$disconnect();
  }
}

main();
