import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: "SUPERADMIN" | "EDITOR" | "SALES" | "CLIENT_ADMIN" | "CLIENT_USER";
    } & DefaultSession["user"];
  }

  interface User {
    role: "SUPERADMIN" | "EDITOR" | "SALES" | "CLIENT_ADMIN" | "CLIENT_USER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "SUPERADMIN" | "EDITOR" | "SALES" | "CLIENT_ADMIN" | "CLIENT_USER";
  }
}
