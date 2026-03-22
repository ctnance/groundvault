import { prisma } from "@/lib/prisma";

// Temporary: use demo user until auth is set up
const DEMO_EMAIL = "demo@groundvault.io";

export async function getDemoUserId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });
  return user?.id ?? null;
}