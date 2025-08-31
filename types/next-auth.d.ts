import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "ADMIN" | "STUDENT";
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: "ADMIN" | "STUDENT";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "STUDENT";
  }
}

