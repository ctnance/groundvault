import Link from "next/link";
import { Vault } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/tokens";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let status: "success" | "invalid" | "missing" = "missing";

  if (token) {
    const record = await verifyToken(token);

    if (record) {
      await prisma.user.updateMany({
        where: { email: record.identifier },
        data: { emailVerified: new Date() },
      });

      await prisma.verificationToken.deleteMany({
        where: { token: record.token },
      });

      status = "success";
    } else {
      status = "invalid";
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex items-center gap-2">
            <Vault className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">GroundVault</span>
          </div>
          <CardTitle className="text-xl">
            {status === "success" && "Email Verified"}
            {status === "invalid" && "Invalid or Expired Link"}
            {status === "missing" && "Missing Token"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {status === "success" && (
            <p className="text-sm text-muted-foreground">
              Your email has been verified. You can now sign in.
            </p>
          )}
          {status === "invalid" && (
            <p className="text-sm text-muted-foreground">
              This verification link is invalid or has expired. Please register again.
            </p>
          )}
          {status === "missing" && (
            <p className="text-sm text-muted-foreground">
              No verification token was provided.
            </p>
          )}
          <Link
            href="/sign-in"
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-2.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Go to Sign In
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}