import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ message: "Data tidak valid" }, { status: 400 });
    }
    const { name, email, password, grade } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
    }

    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: "STUDENT",
        studentProfile: {
          create: { grade }
        }
      }
    });

    return NextResponse.json({ id: user.id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 });
  }
}

