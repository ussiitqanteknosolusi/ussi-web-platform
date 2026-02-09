import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Debug Logging for Deployment
  console.log(`[MIDDLEWARE] ${req.method} ${nextUrl.pathname} | Auth: ${isLoggedIn}`);

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      console.log(`[REDIRECT] Authenticated user on auth page -> /admin`);
      return Response.redirect(new URL("/admin", nextUrl));
    }
    return null;
  }

  if (isAdminRoute || isDashboardRoute) {
    if (!isLoggedIn) {
      console.log(`[REDIRECT] Unauthenticated user on protected route -> /auth/login`);
      return Response.redirect(new URL("/auth/login", nextUrl));
    }
  }

  return null;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
