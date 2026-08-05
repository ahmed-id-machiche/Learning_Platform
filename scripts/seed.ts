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
        { name: "Gestion des Entreprises" },
        { name: "Commerce Digital & Marketing" },
        { name: "Comptabilité & Finance" },
        { name: "Logistique & Transport" },
        { name: "Techniques de Vente" },
        { name: "Administration & RH" },
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
