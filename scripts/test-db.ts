import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  // ── Demo User ─────────────────────────────────────────

  const user = await prisma.user.findUnique({
    where: { email: "demo@groundvault.io" },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      isPro: true,
      emailVerified: true,
    },
  });

  if (!user) {
    console.error("❌ Demo user not found. Run `npm run db:seed` first.");
    process.exit(1);
  }

  console.log(`✓ User: ${user.name} (${user.email})`);
  console.log(`  Password hash: ${user.password?.slice(0, 20)}...`);
  console.log(`  isPro: ${user.isPro}`);
  console.log(`  Email verified: ${user.emailVerified}`);

  // ── Item Types ────────────────────────────────────────

  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });

  console.log(`\n✓ System item types: ${types.length}`);
  for (const t of types) {
    console.log(`  • ${t.name} — ${t.icon} (${t.color})`);
  }

  // ── Collections ───────────────────────────────────────

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`\n✓ Collections: ${collections.length}`);
  for (const c of collections) {
    console.log(`\n  📁 ${c.name} — ${c.description}`);
    for (const ic of c.items) {
      const item = ic.item;
      const extra = item.url ? ` → ${item.url}` : "";
      console.log(`     • [${item.itemType.name}] ${item.title}${extra}`);
    }
  }

  // ── Summary ───────────────────────────────────────────

  const itemCount = await prisma.item.count({ where: { userId: user.id } });
  console.log(`\n✅ Total: ${itemCount} items across ${collections.length} collections`);
}

main()
  .catch((e) => {
    console.error("❌ Database test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
