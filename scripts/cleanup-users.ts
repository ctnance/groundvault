import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const KEEP_EMAIL = "demo@groundvault.io";

async function main() {
  const usersToDelete = await prisma.user.findMany({
    where: { email: { not: KEEP_EMAIL } },
    select: { id: true, email: true, name: true },
  });

  if (usersToDelete.length === 0) {
    console.log("No users to delete. Only the demo user exists.");
    return;
  }

  console.log(`Found ${usersToDelete.length} user(s) to delete:\n`);
  for (const u of usersToDelete) {
    console.log(`  • ${u.name ?? "(no name)"} — ${u.email}`);
  }

  const userIds = usersToDelete.map((u) => u.id);

  // Delete in dependency order (cascades handle most, but be explicit)
  const items = await prisma.item.deleteMany({ where: { userId: { in: userIds } } });
  const collections = await prisma.collection.deleteMany({ where: { userId: { in: userIds } } });
  const sessions = await prisma.session.deleteMany({ where: { userId: { in: userIds } } });
  const accounts = await prisma.account.deleteMany({ where: { userId: { in: userIds } } });
  const users = await prisma.user.deleteMany({ where: { id: { in: userIds } } });

  // Clean up orphaned verification tokens for deleted users
  const emails = usersToDelete.map((u) => u.email);
  const tokens = await prisma.verificationToken.deleteMany({
    where: { identifier: { in: emails } },
  });

  console.log(`\nDeleted:`);
  console.log(`  ${items.count} items`);
  console.log(`  ${collections.count} collections`);
  console.log(`  ${sessions.count} sessions`);
  console.log(`  ${accounts.count} accounts`);
  console.log(`  ${tokens.count} verification tokens`);
  console.log(`  ${users.count} users`);
  console.log(`\nDone. Only ${KEEP_EMAIL} remains.`);
}

main()
  .catch((e) => {
    console.error("Cleanup failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());