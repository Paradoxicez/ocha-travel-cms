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
        const username = credentials?.username as string;
        const password = credentials?.password as string;

        if (!username || !password) return null;

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) return null;
        if (username !== adminUsername) return null;

        const valid = await bcrypt.compare(password, adminPasswordHash);
        if (!valid) return null;

        return { id: "1", name: adminUsername };
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
