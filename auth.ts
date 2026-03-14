import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const username = credentials?.username as string;
          const password = credentials?.password as string;

          console.log("[auth] authorize called, username:", username);

          if (!username || !password) {
            console.log("[auth] missing username or password");
            return null;
          }

          const adminUsername = process.env.ADMIN_USERNAME;
          const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

          console.log("[auth] env ADMIN_USERNAME:", adminUsername);
          console.log("[auth] env ADMIN_PASSWORD_HASH exists:", !!adminPasswordHash);
          console.log("[auth] env ADMIN_PASSWORD_HASH length:", adminPasswordHash?.length);

          if (!adminUsername || !adminPasswordHash) {
            console.log("[auth] missing env vars");
            return null;
          }
          if (username !== adminUsername) {
            console.log("[auth] username mismatch");
            return null;
          }

          const valid = await bcrypt.compare(password, adminPasswordHash);
          console.log("[auth] bcrypt compare result:", valid);
          if (!valid) return null;

          return { id: "1", name: adminUsername };
        } catch (err) {
          console.error("[auth] authorize error:", err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith("/admin");
      const isLogin = request.nextUrl.pathname === "/admin/login";
      const isLoggedIn = !!session?.user;

      if (isAdmin && !isLogin && !isLoggedIn) return false;
      return true;
    },
  },
});
