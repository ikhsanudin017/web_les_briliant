import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export async function GET(req: Request) {
  await requireRole(["ADMIN"]);
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      OR: q ? [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ] : undefined,
    },
    include: { studentProfile: true },
    orderBy: { createdAt: "desc" },
  });

  const header = ["id", "name", "email", "grade", "createdAt"].join(",");
  const rows = students.map((s) => [
    s.id,
    escapeCsv(s.name),
    s.email,
    s.studentProfile?.grade ?? "",
    s.createdAt.toISOString()
  ].join(","));
  const csv = [header, ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=students.csv`,
    },
  });
}

function escapeCsv(v: string) {
  if (v.includes(",") || v.includes("\n") || v.includes("\"")) {
    return '"' + v.replace(/"/g, '""') + '"';
  }
  return v;
}

