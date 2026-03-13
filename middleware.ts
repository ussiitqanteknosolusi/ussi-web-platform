import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

// 1. Daftar User-Agent bot yang dilarang (agresif/tidak berguna)
const BLOCKED_BOTS = [
  'bytespider', 'petalbot', 'go-http-client', 'ahrefsbot', 
  'semrushbot', 'dotbot', 'mj12bot', 'cyberscan', 'python-requests',
  'curl', 'wget', 'java', 'libwww-perl'
];

// 2. Daftar path ilegal yang sering dipindai bot nakal
const ILLEGAL_PATHS = [
  '.env', '.git', 'wp-admin', 'wp-login', 'config.php', 'api/.env',
  'phpmyadmin', 'setup.php', 'install.php', 'admin.php', '.aws'
];

export default auth((req: any) => {
  const { nextUrl, headers } = req;
  const userAgent = headers.get('user-agent')?.toLowerCase() || '';
  const pathname = nextUrl.pathname.toLowerCase();

  // --- KEAMANAN LEVEL 1: BLOKIR BOT NAKAL ---
  if (BLOCKED_BOTS.some(bot => userAgent.includes(bot))) {
    return new Response('Access Denied: Restricted Bot Detected', { status: 403 });
  }

  // --- KEAMANAN LEVEL 2: BLOKIR PEMINDAIAN ILEGAL ---
  if (ILLEGAL_PATHS.some(path => pathname.includes(path))) {
    return new Response('Forbidden: Illegal operation', { status: 403 });
  }

  // --- LOGIKA NORMAL NEXT-AUTH ---
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/admin", nextUrl));
    }
    return null;
  }

  if (isAdminRoute || isDashboardRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/login", nextUrl));
    }
  }

  return null;
});

// ✅ PERFORMANCE: Run middleware globally to catch bots early,
// but EXCLUDE static files, images, fonts, and _next assets to save CPU.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) -> We'll handle API protection separately
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (SEO files)
     * - images/ (public images)
     * - public/
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|public).*)',
  ],
};
