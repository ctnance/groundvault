import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Placeholder — real validation lives in auth.ts to avoid
      // bundling bcryptjs into the Edge middleware.
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig;