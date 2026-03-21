const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing all MenuItems from the database...");
  const deleted = await prisma.menuItem.deleteMany({});
  console.log(`Successfully deleted ${deleted.count} menu items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
