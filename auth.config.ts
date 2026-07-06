import { NextAuthConfig } from "next-auth";
import type { Role } from "@/app/lib/definition";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role as string;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnCurriculum = nextUrl.pathname.startsWith("/curriculum");
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isProtected = isOnCurriculum || isOnDashboard || isOnAdmin;
      const home: Record<string, string> = {
        student: "/curriculum",
        teacher: "/dashboard",
        admin: "/admin",
      };

      if (!isLoggedIn) return isProtected ? false : true;
      if (
        (role === "student" && !isOnCurriculum) ||
        (role === "teacher" && !isOnDashboard) ||
        (role == "admin" && !isOnAdmin) ||
        !isProtected
      )
        return Response.redirect(new URL(home[role], nextUrl));
      return true;
    },
    // Persist custom fields on the token at sign-in (`user` is only set then)...
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // ...and expose them on the session so `auth.user.role` is available here
    // AND in server components / the middleware.
    async session({ session, token }) {
      session.user.role = token.role as Role;
      session.user.id = token.sub as string;
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
