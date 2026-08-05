import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

const validCategories = [
  "Gestion des Entreprises",
  "Commerce Digital & Marketing",
  "Comptabilité & Finance",
  "Logistique & Transport",
  "Techniques de Vente",
  "Administration & RH",
];

async function main() {
  try {
    console.log("Cleaning up non-Commerce & Gestion categories...");

    // Find categories to delete
    const categoriesToDelete = await db.category.findMany({
      where: {
        name: {
          notIn: validCategories,
        },
      },
    });

    const idsToDelete = categoriesToDelete.map((c) => c.id);

    if (idsToDelete.length > 0) {
      // First delete courses under non-OFPPT Commerce categories
      await db.course.deleteMany({
        where: {
          categoryId: {
            in: idsToDelete,
          },
        },
      });

      // Now delete the non-OFPPT Commerce categories
      const result = await db.category.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      });

      console.log(`Deleted ${result.count} non-Commerce & Gestion categories.`);
    } else {
      console.log("No non-Commerce & Gestion categories found to delete.");
    }
  } catch (error) {
    console.error("Error cleaning up categories:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
