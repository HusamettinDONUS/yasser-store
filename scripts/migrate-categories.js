const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function migrateCategoryData() {
  try {
    console.log("Starting category data migration...");

    // First, let's see what categories exist
    const products =
      await prisma.$queryRaw`SELECT DISTINCT category FROM "Product"`;
    console.log("Existing categories:", products);

    // Update any 'jackets' to 'JACKETS' to match enum
    const updateResult = await prisma.$executeRaw`
      UPDATE "Product" 
      SET category = 'JACKETS' 
      WHERE category = 'jackets'
    `;

    console.log(
      `Updated ${updateResult} products with category 'jackets' to 'JACKETS'`
    );

    // Update any other non-enum values to uppercase if needed
    const categoryMappings = {
      men: "MEN",
      women: "WOMEN",
      kids: "KIDS",
      accessories: "ACCESSORIES",
    };

    for (const [oldValue, newValue] of Object.entries(categoryMappings)) {
      const result = await prisma.$executeRaw`
        UPDATE "Product" 
        SET category = ${newValue}
        WHERE category = ${oldValue}
      `;
      if (result > 0) {
        console.log(
          `Updated ${result} products with category '${oldValue}' to '${newValue}'`
        );
      }
    }

    // Show final categories
    const finalProducts =
      await prisma.$queryRaw`SELECT DISTINCT category FROM "Product"`;
    console.log("Final categories after migration:", finalProducts);

    console.log("✅ Category migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateCategoryData();
