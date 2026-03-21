import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  // Test connection by counting users
  const userCount = await prisma.user.count();
  console.log(`Users in database: ${userCount}`);

  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: "test@groundvault.dev",
      name: "Test User",
    },
  });
  console.log(`Created test user: ${user.name} (${user.email})`);

  // Verify the user exists
  const found = await prisma.user.findUnique({
    where: { email: "test@groundvault.dev" },
  });
  console.log(`Found user: ${found?.name}`);

  // Clean up
  await prisma.user.delete({ where: { id: user.id } });
  console.log("Deleted test user");

  console.log("\nDatabase connection successful!");
}

main()
  .catch((e) => {
    console.error("Database test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());