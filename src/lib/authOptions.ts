import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "@/lib/db";
import { User } from "@/lib/models/User";
import { compare } from "bcryptjs";
import { z } from "zod";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const schema = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        });

        const parsed = schema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectToDb();
        const user = await User.findOne({ email: parsed.data.email }).lean();
        if (!user) return null;

        const ok = await compare(parsed.data.password, (user as any).passwordHash);
        if (!ok) return null;

        return {
          id: (user as any)._id.toString(),
          email: (user as any).email,
          name: (user as any).name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  // In production you should set NEXTAUTH_SECRET.
  // For local MVP progress, fall back to a deterministic dev secret.
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-beyond-routes",
};

