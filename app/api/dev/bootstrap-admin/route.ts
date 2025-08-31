import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Not allowed" }, { status: 403 });
  }
  const email = process.env.ADMIN_EMAIL || "admin@brilliant-les.id";
  const name = process.env.ADMIN_NAME || "Administrator";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await hash(password, 10);

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
    return NextResponse.json({ ok: true, message: "Admin updated to ADMIN role", email });
  }
  await prisma.user.create({ data: { email, name, password: passwordHash, role: "ADMIN" } });
  return NextResponse.json({ ok: true, message: "Admin created", email });
}

