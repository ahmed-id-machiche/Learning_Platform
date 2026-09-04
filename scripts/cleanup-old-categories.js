import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  const allowedNames = [
    "1ère Année TSGE",
    "1ère Année TAA",
    "TSGE CF",
    "TSGE CM",
    "TSGE OM",
    "TSGE RH",
    "TAA Comptabilité",
    "TAA Gestion",
  ];

  console.log("Cleaning up old generic category records...");

  const oldCategories = await db.category.findMany({
    where: {
      name: {
        notIn: allowedNames,
      },
    },
  });

  console.log(`Found ${oldCategories.length} old generic categories:`, oldCategories.map(c => c.name));

  for (const oldCat of oldCategories) {
    // Unlink courses attached to old category
    await db.course.updateMany({
      where: { categoryId: oldCat.id },
      data: { categoryId: null },
    });

    // Delete old category
    await db.category.delete({
      where: { id: oldCat.id },
    });
  }

  console.log("Old generic categories removed successfully!");
  await db.$disconnect();
}

main();
