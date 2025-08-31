import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireRole(roles: ("ADMIN" | "STUDENT")[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || !roles.includes(session.user.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

